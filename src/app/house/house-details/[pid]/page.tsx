'use client';
import HouseContribution from '@/components/HouseContribution';
import ListMembers from '@/components/ListMembers';
import ManualCollections from '@/components/ManualTutioncollections';
import PendingTransactions from '@/components/PendingTransactions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { withAuth } from '@/components/withAuth';
import axios from 'axios';
import { Loader2, ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense, useEffect, useState } from 'react';

// Skeleton component for loading state
const SkeletonLoader = () => (
  <div className="animate-pulse p-4 space-y-4">
    <div className="flex justify-between items-center">
      <div className="bg-gray-200 h-8 w-24 rounded-md"></div>
      <div className="bg-gray-200 h-8 w-24 rounded-md"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="p-4">
          <div className="bg-gray-200 h-6 w-1/2 rounded-md mb-2"></div>
          <div className="bg-gray-200 h-4 w-full rounded-md"></div>
        </Card>
      ))}
    </div>
  </div>
);

interface PageProps {
  params: {
    pid: string;
  };
}

interface Member {
  name: string;
  status: string;
  DOB: Date;
  maritalStatus: string;
  education: string;
  gender: string;
  mobile: string;
}

const PageComponent = ({ params }: PageProps) => {
  const { pid } = params;
  const [house, setHouse] = useState<any>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [totalContribution, setTotalContribution] = useState(<Loader2 className="animate-spin" />);
  const [totalHouseCollections, setTotalHouseCollections] = useState(<Loader2 className="animate-spin" />);
  const [familyHead, setFamilyHead] = useState({ memberId: '', amount: 0 });
  const [editHouse, setEditHouse] = useState<any>({});

  useEffect(() => {
    fetchHouse(pid);
    fetchMembers();
  }, [pid]);

  const fetchMembers = async () => {
    axios
      .get(`${apiUrl}/api/member/all-members/${pid}`)
      .then((response) => {
        if (response.data.success) {
          setMembers(response.data.members);
        }
      })
      .catch((error) => {
        console.error('Error fetching members:', error);
      });
  };

  const fetchHouse = async (id: string) => {
    try {
      const response = await axios.get(`${apiUrl}/api/house/get/${id}`);
      setHouse(response.data.house);
      setFamilyHead({
        memberId: response.data.house?.familyHead,
        amount: response.data.house?.collectionAmount || 0,
      });
    } catch (error) {
      console.error('Error fetching house:', error);
    }
  };

  const handleFamilyHeadChange = (field: string, value: string) => {
    setFamilyHead((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmitEdit = async () => {
    setLoading(true);
    const data = {
      _id: house._id,
      name: editHouse.name,
      number: editHouse.number,
      address: editHouse.address,
      familyHead: familyHead.memberId,
      collectionAmount: familyHead.amount,
      status: editHouse.status,
      rationsStatus: editHouse.rationStatus,
      panchayathNumber: editHouse.panchayathNumber,
      wardNumber: editHouse.wardNumber,
    };
    try {
      const response = await axios.put(`${apiUrl}/api/house/edit-house`, data);
      if (response.data.success) {
        setLoading(false);
        setFamilyHead({ memberId: '', amount: 0 });
        setIsOpen(false);
        fetchHouse(pid);
        toast({
          title: 'House edited successfully',
          variant: 'default',
        });
      }
    } catch (error: any) {
      setLoading(false);
      toast({
        title: 'Error editing house',
        description: error.response?.data?.message || error.message || 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  if (!house) {
    return <SkeletonLoader />;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/house" className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
        <Link
          href={`/house/add-member/${house?._id}`}
          className="flex items-center bg-black text-white rounded-md px-4 py-2 text-sm hover:bg-gray-900 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="bg-gray-50 rounded-t-lg p-4">
            <CardTitle className="text-xl font-semibold">House {house?.number}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-3 text-sm">
              <p className="font-medium text-gray-600">Name:</p>
              <p className="col-span-2 text-gray-900">{house?.name}</p>
            </div>
            <div className="grid grid-cols-3 text-sm">
              <p className="font-medium text-gray-600">Address:</p>
              <p className="col-span-2 text-gray-900 truncate">{house?.address}</p>
            </div>
          </CardContent>
          {house?.familyHead ? (
            <CardFooter className="flex justify-between items-center p-4 bg-gray-50 rounded-b-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-800">Family Head: {house?.familyHead.name}</p>
                <p className="text-xs text-gray-600">Collection: ₹{house?.collectionAmount}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOpen(true);
                  setEditHouse(house);
                  handleFamilyHeadChange('memberId', house?.familyHead?._id);
                }}
              >
                Edit
              </Button>
            </CardFooter>
          ) : (
            <CardFooter className="flex justify-end p-4 bg-gray-50 rounded-b-lg">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Set Family Head
              </Button>
            </CardFooter>
          )}
        </Card>
        <Card className="rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200">
  <div className="p-6">
    <div className="text-sm font-medium text-gray-500">Total Contributions</div>
    <div className="text-3xl font-bold text-gray-900 mt-2">₹ {totalContribution}</div>
  </div>
  <div className="p-6 border-t border-gray-100">
      <div className="text-sm font-medium text-gray-500">Total House Collections</div>
      <div className="text-2xl font-semibold text-gray-900">₹ {totalHouseCollections}</div>
  </div>
</Card>
      </div>

      <div className="my-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">House Collections</h2>
          <ManualCollections houseId={pid} collectionAmount={house?.collectionAmount} />
        </div>
        <PendingTransactions id={house?.familyHead?._id} totalCollections={setTotalHouseCollections} />
      </div>

      <ListMembers members={members} familyHead={house?.familyHead} />

      <div className="my-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Contributions from House {house?.number}
        </h2>
        <HouseContribution id={house?._id} contribution={setTotalContribution} />
      </div>
      <Dialog open={isOpen} onOpenChange={(v) => !v && setIsOpen(v)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
          <DialogTitle className="text-lg font-semibold">Edit House Details</DialogTitle>
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">House Number</Label>
                <Input
                  type="text"
                  placeholder="House Number"
                  value={editHouse?.number}
                  onChange={(e) => setEditHouse({ ...editHouse, number: e.target.value })}
                  disabled={loading}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Panchayath Number</Label>
                <Input
                  type="text"
                  placeholder="Panchayath Number"
                  value={editHouse?.panchayathNumber}
                  onChange={(e) => setEditHouse({ ...editHouse, panchayathNumber: e.target.value })}
                  disabled={loading}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Ward Number</Label>
                <Input
                  type="text"
                  placeholder="Ward Number"
                  value={editHouse?.wardNumber}
                  onChange={(e) => setEditHouse({ ...editHouse, wardNumber: e.target.value })}
                  disabled={loading}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">House Name</Label>
                <Input
                  disabled={loading}
                  type="text"
                  placeholder="House Name"
                  value={editHouse?.name}
                  onChange={(e) => setEditHouse({ ...editHouse, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Address</Label>
                <Textarea
                  disabled={loading}
                  placeholder="Address"
                  value={editHouse?.address}
                  onChange={(e) => setEditHouse({ ...editHouse, address: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">House Status</Label>
                  <Select
                    name="status"
                    onValueChange={(value) => setEditHouse({ ...editHouse, status: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={editHouse?.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="owned">Owned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Ration Status</Label>
                  <Select
                    name="Rationstatus"
                    onValueChange={(value) => setEditHouse({ ...editHouse, rationStatus: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder={editHouse?.rationsStatus} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AAY/Yellow">AAY/Yellow</SelectItem>
                      <SelectItem value="BPL/Pink">BPL/Pink</SelectItem>
                      <SelectItem value="APL/Blue">APL/Blue</SelectItem>
                      <SelectItem value="White Card">White Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Family Head</Label>
                <Select
                  value={familyHead.memberId}
                  onValueChange={(value) => handleFamilyHeadChange('memberId', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {members?.map((member: any) => (
                        <SelectItem key={member._id} value={member._id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Collection Amount</Label>
                <Input
                  disabled={loading}
                  type="number"
                  placeholder="Amount"
                  value={familyHead.amount}
                  onChange={(e) => handleFamilyHeadChange('amount', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end">
                {loading ? (
                  <Button disabled>
                    <Loader2 className="animate-spin mr-2" />
                    Submitting...
                  </Button>
                ) : (
                  <Button onClick={handleSubmitEdit}>Submit</Button>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Page = withAuth(({ params }: any) => (
  <Suspense fallback={<SkeletonLoader />}>
    <PageComponent params={params} />
  </Suspense>
));

export default Page;