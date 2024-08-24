'use client'
import { withAuth } from '@/components/withAuth'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue, SelectGroup } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import DatePicker from '@/components/DatePicker'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

interface PageProps {
  params: {
    pid: string
  }
}

interface Member {
  name: string
  status: string,
  DOB: Date,
  maritalStatus: string
  education: string,
  gender:string,
  mobile: string,
place:string
}

const PageComponent = ({ params }: PageProps) => {
  const { pid } = params
  const router = useRouter();
  const { toast } = useToast()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false);
  const [newMember, setNewMember] = useState<Member>({
    name: '',
    status: '',
    DOB: new Date(),
    maritalStatus: '',
    gender:'',
    education: '',
    mobile: '',
    place:''
  })
  const [selectedRelation, setSelectedRelation] = useState({ memberId: '', relation: '' })

  const handleRelationChange = (field: string, value: string) => {
    setSelectedRelation(prevState => ({
      ...prevState,
      [field]: value
    }))
  }
  // Fetch members on component mount
  useEffect(() => {
    axios.get(`${apiUrl}/api/member/all-members/${pid}`)
      .then(response => {
        if(response.data.success){
          setMembers(response.data.members)
        }
      })
      .catch(error => {
        console.error("Error fetching members:", error)
      })
  }, [pid])


  const validate = () => {
    const currentYear = new Date().getFullYear();
const dobYear = new Date(newMember.DOB).getFullYear();
    let isValid = true;
  
    if(!newMember.name){
        toast({
            title: "Please fill member name",
            variant: "destructive",
        });
        isValid = false;
    }
    if (!newMember.status) {
        toast({
            title: "Please fill current ocupation",
            variant: "destructive",
        });
        isValid = false;
    }
    if (!newMember.maritalStatus) {
        toast({
            title: "Please fill marital status",
            variant: "destructive",
        });
        isValid = false;
    }
    if (!newMember.gender) {
        toast({
            title: "Please fill gender",
            variant: "destructive",
        });
        isValid = false;
    }
    if (!newMember.education) {
        toast({
            title: "Please fill education if there else NILL",
            variant: "destructive",
        });
        isValid = false;
    }
    if (!newMember.DOB || dobYear === currentYear) {
        toast({
            title: "Please enter a valid Date of Birth",
            variant: "destructive",
        });
        isValid = false;
    }
    if (!newMember.place) {
        toast({
            title: "Please select place",
            variant: "destructive",
            });
    }
    if (selectedRelation.memberId === '') {
      toast({
        title: "Please select a member to relate",
        variant: "destructive",
      });
      return false;
    }
    if (selectedRelation.relation === '') {
      toast({
        title: "Please select a relation type",
        variant: "destructive",
      });
      return false;
    }
    return isValid;
};
  // Handle form submission for creating a new member
  const handleCreateMember = async() => {
    if (!validate()) return;
    setLoading(true);
   try {
    const data = {
      newMember,
      selectedRelation,
      houseId: pid
    }
    const response = await axios.post(`${apiUrl}/api/member/create`, data)
    if (response.data.success) {
      setNewMember({
        name: '',
        status: '',
        DOB: new Date(),
        maritalStatus: '',
        gender:'',
        education: '',
        mobile: '',
        place:''
      })
      setSelectedRelation({ memberId: '', relation: '' })
      router.push(`/house/house-details/${pid}`);
      setLoading(false)
   }
  } catch (error:any) {
    toast({
        title: "Error creating member",
        description: error?.response?.data?.message || error.message || 'Something went wrong',
        variant: "destructive",
    });
    setLoading(false);
   }
    

  }
  const relations = [
    'husband',
    'wife',
    'son',
    'daughter',
    'brother',
    'sister',
  ]
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setNewMember((prev) => ({ ...prev, [name]: value }));
  };
  const handleDateChange = (date: any) => {
    setNewMember((prev) => ({ ...prev, DOB: date }));
  };
  return (
    <div className='p-2'>
     <div className='max-w-5xl mx-auto'>
     <div className="mb-4 flex justify-between items-center">
        <Link href={`/house/house-details/${pid}`} className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
          Back
        </Link>
      </div>

      <div className='mx-auto p-4 bg-white rounded-md border my-8'>
        <h2 className='text-2xl font-semibold mb-4'>Add New Member</h2>
        <div className='space-y-4'>
          <div>
            <Input
              type='text'
              name='name'
              placeholder='Enter name'
              value={newMember.name}
              onChange={handleChange}
              className=' block w-full border p-2 rounded-md shadow-sm  sm:text-sm'
            />
          </div>


          <div className='grid grid-cols-2 gap-2'>
            <Input
              type='text'
              name='status'
              placeholder='Current occupation'
              value={newMember.status}
              onChange={handleChange}
              className=' block w-full border px-2 py-4 rounded-md shadow-sm  sm:text-sm'
            />
            <Select
                name='gender'
                onValueChange={(value) => setNewMember((prev) => ({ ...prev, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='male'>
                    Male
                  </SelectItem>
                  <SelectItem value='female'>
                    Female
                  </SelectItem>
                </SelectContent>
              </Select>
          </div>

          <div className='grid grid-cols-2 gap-1'>
            <div>
              <p className='text-sm font-medium' >
                Date of birth
              </p>
              <DatePicker date={newMember.DOB} setDate={handleDateChange} />
            </div>
            <div>
              <p className='text-sm font-medium'>
                Marital status
              </p>
              <Select
                name='maritalStatus'
                onValueChange={(value) => setNewMember((prev) => ({ ...prev, maritalStatus: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='maried'>
                    Married
                  </SelectItem>
                  <SelectItem value='unmarried'>
                    Unmarried
                  </SelectItem>
                  <SelectItem value='divorced'>
                    Divorced
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
          <Select
                                name='education'
                                onValueChange={(value) => setNewMember((prev) => ({ ...prev, education: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Education" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="Below 10th">Below 10th</SelectItem>
                                <SelectItem value="SSLC">SSLC</SelectItem>
                                <SelectItem value="Plus Two">Plus Two</SelectItem>
                                    <SelectItem value="Bachelors">Bachelors</SelectItem>
                                    <SelectItem  value="Diploma">Diploma</SelectItem>
                                    <SelectItem value="Masters">Masters</SelectItem>
                                </SelectContent>
                            </Select>
          </div>

          <div>
            <Input
              type='tel'
              name='mobile'
              placeholder='Enter mobile number'
              value={newMember.mobile}
              onChange={handleChange}
              className=' block w-full border p-2 rounded-md shadow-sm  sm:text-sm'
            />
          </div>
          <div>
          <Label>
                            Select place
                        </Label>
          <Select
                name='place'
                onValueChange={(value) => setNewMember((prev) => ({ ...prev, place: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Place" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='Kerala'>
                   Kerala
                  </SelectItem>
                  <SelectItem value='UAE'>
                    UAE
                  </SelectItem>
                  <SelectItem value='Malaysia'>
                  Malaysia
                  </SelectItem>
                  <SelectItem value='Singapore'>
                  Singapore
                  </SelectItem>
                  <SelectItem value='Kuwait'>
                  Kuwait
                  </SelectItem>
                  <SelectItem value='Outside kerala'>
                  Outside kerala
                  </SelectItem>
                </SelectContent>
              </Select>
                    </div>
        </div>
      </div>

      {members.length > 0 ? (
        <div>
          <h2 className='text-xl font-semibold mb-2'>Add Relation</h2>
          <div className='mb-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='mb-2'>
              <Select onValueChange={(value) => handleRelationChange('memberId', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select Member' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {members.map((member: any) => (
                      <SelectItem key={member._id} value={member._id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='mb-2'>
              <Select onValueChange={(value) => handleRelationChange('relation', value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select Relation' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {relations.map((relation, index) => (
                      <SelectItem key={index} value={relation}>
                        {relation}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ) : null}
        <Button
            disabled={loading}
            onClick={handleCreateMember}
          >
            Add Member
          </Button>
     </div>
    </div>
  )
}

export default PageComponent
