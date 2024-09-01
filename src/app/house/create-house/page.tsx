'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { useHouseContext } from '@/context/HouseContext'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DatePicker from '@/components/DatePicker'
import { useToast } from '@/components/ui/use-toast'
import Spinner from '@/components/Spinner'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'


interface Member {
    name: string
    status: string,
    DOB: Date,
    maritalStatus: string
    education: {
      level: string,
      description: string
    },
    bloodGroup: string,
    madrassa: {
      studying: boolean,
      currentClass: string,
      lastClassStudied: string,
    },
    gender: string,
    mobile: string,
    whatsappNumber:'',
    place: string,
    idCards: {
      aadhaar: boolean,
      drivingLicense: boolean,
      voterID: boolean,
      panCard: boolean,
    },
  }

const Page = () => {
    const { toast } = useToast()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [houseNumber, setHouseNumber] = useState<string>('');
    const [houseName, setHouseName] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [panchayathNumber, setPanchayathNumber] = useState<string>('');
    const [wardNumber, setWardNumber] = useState<string>('');
    const [rationstatus, setRationStatus] = useState<string>('');
    const [houseAddress, setHouseAddress] = useState<string>('');
    const [collection, setCollection] = useState<number>();
    const [loading, setloading] = useState(false);
    const router = useRouter();
    const [newMember, setNewMember] = useState<Member>({
        name: '',
        status: '',
        DOB: new Date(),
        maritalStatus: '',
        gender: '',
        education: {
          level: '',
          description: ''
        },
        bloodGroup: '',
        madrassa: {
          studying: false,
          currentClass: '',
          lastClassStudied: '',
        },
        mobile: '',
        whatsappNumber:'',
        place: '',
        idCards: {
          aadhaar: false,
          drivingLicense: false,
          voterID: false,
          panCard: false,
        },
      })

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setNewMember((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: any) => {
        setNewMember((prev) => ({ ...prev, DOB: date }));
    };
    const handleMadrassaChange = (field:any, value:any) => {
        setNewMember((prev) => ({
          ...prev,
          madrassa: { ...prev.madrassa, [field]: value },
        }));
      };
      const handleIdCardChange = (card:any, value:any) => {
        setNewMember((prev) => ({
          ...prev,
          idCards: { ...prev.idCards, [card]: value },
        }));
      };


    const validate = () => {
        const currentYear = new Date().getFullYear();
const dobYear = new Date(newMember.DOB).getFullYear();
        let isValid = true;
        if (!houseNumber) {
            toast({
                title: "House Number is required",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!wardNumber) {
            toast({
                title: "Ward Number is required",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!houseName) {
            toast({
                title: "House Name is required",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!houseAddress) {
            toast({
                title: "House Address is required",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!status) {
            toast({
                title: "Please select status",
                variant: "destructive",
            });
            isValid = false;
        }
        if (!rationstatus) {
            toast({
                title: "Please enter ration status",
                variant: "destructive",
            });
            isValid = false;
        }
        if(collection !== undefined && collection < 1){
            toast({
                title: "Please enter valid collection Amount",
                variant: "destructive",
            });
            isValid = false;
        }
        if(!newMember.name){
            toast({
                title: "Please Fill Family head Name",
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
        if (!newMember.education.level) {
            toast({
              title: "Please fill education level",
              variant: "destructive",
            });
            isValid = false;
          }
          if (!newMember.bloodGroup) {
            toast({
              title: "Please fill blood group",
              variant: "destructive",
            });
            return false;
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
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setloading(true);
        try {
            const newHouse = {
                number: houseNumber,
                panchayathNumber:panchayathNumber,
                wardNumber:wardNumber,
                name: houseName,
                address: houseAddress,
                status: status,
                rationsStatus: rationstatus,
                collectionAmount: collection,
            };
            const data = {
                newHouse,
                newMember
            };

            // Send POST request to create a new house
            const response = await axios.post(`${apiUrl}/api/house/create-house`, data);

            if (response.data.success) {
                toast({
                    title: "House created successfully",
                    variant: "default",
                });
                setHouseNumber('');
                setHouseName('');
                setHouseAddress('');
                setStatus('');
                setRationStatus('');
                setCollection(0);
                setNewMember({
                    name: '',
                    status: '',
                    DOB: new Date(),
                    maritalStatus: '',
                    gender: '',
                    education: {
                      level: '',
                      description: ''
                    },
                    bloodGroup: '',
                    madrassa: {
                      studying: false,
                      currentClass: '',
                      lastClassStudied: '',
                    },
                    mobile: '',
                    whatsappNumber:'',
                    place: '',
                    idCards: {
                      aadhaar: false,
                      drivingLicense: false,
                      voterID: false,
                      panCard: false,
                    },
                  })
                    setloading(false);
                    router.push('/house');
            }
        } catch (error:any) {
            toast({
                title: "Error creating house",
                description: error?.response?.data?.message || error.message,
                variant: "destructive",
            });
            setloading(false);
        }
    };

    return (
       <>
       {loading ? (
<Spinner/>
       ):
       ( <div className='p-2'>
        <div className='max-w-5xl mx-auto'>
            <div className="mb-4 flex justify-between items-center">
                <Link href={`/house`} className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
                    Back
                </Link>
            </div>

            <div className='mx-auto p-4 bg-white rounded-md border my-8'>
                <h2 className='text-2xl font-semibold mb-4'>Add New House</h2>
                <div className='space-y-4 mb-2'>
                    <div>
                        <Input
                            type="text"
                            placeholder="House Number"
                            value={houseNumber}
                            onChange={(e) => setHouseNumber(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <Input
                            type="text"
                            placeholder="Panchayath Number"
                            value={panchayathNumber}
                            onChange={(e) => setPanchayathNumber(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <Input
                            type="text"
                            placeholder="Ward Number"
                            value={wardNumber}
                            onChange={(e) => setWardNumber(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <Input
                            type="text"
                            placeholder="House Name"
                            value={houseName}
                            onChange={(e) => setHouseName(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <Textarea
                            placeholder="Address"
                            value={houseAddress}
                            onChange={(e) => setHouseAddress(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                    <Select
                name='status'
                onValueChange={(value) => 
                    setStatus(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='rented'>
                    Rented
                  </SelectItem>
                  <SelectItem value='owned'>
                  Owned
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select
                name='Rationstatus'
                onValueChange={(value) => 
                    setRationStatus(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ration Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='APL'>
                    APL
                  </SelectItem>
                  <SelectItem value='BPL'>
                 BPL
                  </SelectItem>
                </SelectContent>
              </Select>
                    </div>
                    <div>
                        <Input
                            type="text"
                            placeholder="Collection amount"
                            value={collection}
                            onChange={(e) => setCollection(Number(e.target.value))}
                            disabled={loading}
                        />
                    </div>
                </div>
                <h2 className='text-xl font-semibold mb-4'>Add Family Head</h2>
                <div className='space-y-4'>
                    <div>
                        <Input
                            type='text'
                            name='name'
                            placeholder='Enter name'
                            value={newMember.name}
                            onChange={handleChange}
                            className='block w-full border p-2 rounded-md shadow-sm  sm:text-sm'
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                        <Input
                            type='text'
                            name='status'
                            placeholder='Current occupation'
                            value={newMember.status}
                            onChange={handleChange}
                            className='block w-full border px-2 py-4 rounded-md shadow-sm  sm:text-sm'
                        />
                        <Select
                            name='gender'
                            onValueChange={(value) => setNewMember((prev) => ({ ...prev, gender: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='male'>Male</SelectItem>
                                <SelectItem value='female'>Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='grid grid-cols-2 gap-1'>
                        <div>
                            <p className='text-sm font-medium'>Date of birth</p>
                            <DatePicker date={newMember.DOB} setDate={handleDateChange} />
                        </div>
                        <div>
                            <p className='text-sm font-medium'>Marital status</p>
                            <Select
                                name='maritalStatus'
                                onValueChange={(value) => setNewMember((prev) => ({ ...prev, maritalStatus: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='married'>Married</SelectItem>
                                    <SelectItem value='unmarried'>Unmarried</SelectItem>
                                    <SelectItem value='divorced'>Divorced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <p className='text-base font-bold'>ID cards</p>
            <div className='space-y-2 grid grid-cols-2'>
            <div>
              <p className='text-sm'>Aadhaar</p>
              <RadioGroup
              className='flex'
                value={newMember.idCards.aadhaar ? 'yes' : 'no'}
                onValueChange={(value) => handleIdCardChange('aadhaar', value === 'yes')}
              >
                <Label>
                  Yes
                </Label>
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <Label>No</Label>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
            </div>

            <div>
              <p className='text-sm'>Driving License</p>
              <RadioGroup
              className='flex'
                value={newMember.idCards.drivingLicense ? 'yes' : 'no'}
                onValueChange={(value) => handleIdCardChange('drivingLicense', value === 'yes')}
              >
                <Label>
                  Yes
                </Label>
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <Label>No</Label>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
            </div>

            <div>
              <p className='text-sm'>Voter ID</p>
              <RadioGroup
              className='flex'
                value={newMember.idCards.voterID ? 'yes' : 'no'}
                onValueChange={(value) => handleIdCardChange('voterID', value === 'yes')}
              >
                <Label>
                  Yes
                </Label>
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <Label>No</Label>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
            </div>

            <div>
              <p className='text-sm'>PAN Card</p>
              <RadioGroup
              className='flex'
                value={newMember.idCards.panCard ? 'yes' : 'no'}
                onValueChange={(value) => handleIdCardChange('panCard', value === 'yes')}
              >
                 <Label>
                  Yes
                </Label>
                <RadioGroupItem value="yes">Yes</RadioGroupItem>
                <Label>No</Label>
                <RadioGroupItem value="no">No</RadioGroupItem>
              </RadioGroup>
            </div>
          </div>
          <div>
              <p className='text-sm font-medium'>Blood Group</p>
              <Select
                name='bloodGroup'
                onValueChange={(value) => setNewMember((prev) => ({ ...prev, bloodGroup: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='A+'>A+</SelectItem>
                  <SelectItem value='A-'>A-</SelectItem>
                  <SelectItem value='B+'>B+</SelectItem>
                  <SelectItem value='B-'>B-</SelectItem>
                  <SelectItem value='O+'>O+</SelectItem>
                  <SelectItem value='O-'>O-</SelectItem>
                  <SelectItem value='AB+'>AB+</SelectItem>
                  <SelectItem value='AB-'>AB-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-2 gap-2'>
            <div>
              <p className='text-sm font-medium'>Madrassa</p>
              <Select
                name='madrassaStudying'
                onValueChange={(value) => handleMadrassaChange('studying', value === 'yes')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Studying Madrassa Y/N" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='yes'>Yes</SelectItem>
                  <SelectItem value='no'>No</SelectItem>
                </SelectContent>
              </Select>
              </div>
              {newMember.madrassa.studying ? (
               <div>
               <p className='text-sm font-medium'>Class</p>
                <Input
                  type='text'
                  name='currentClass'
                  placeholder='Current Class'
                  value={newMember.madrassa.currentClass}
                  onChange={(e) => handleMadrassaChange('currentClass', e.target.value)}
                  className='block w-full border p-2 rounded-md shadow-sm sm:text-sm'
                />
                </div>
              ) : (
                <div>
                <p className='text-sm font-medium'>Class</p>
                <Input
                  type='text'
                  name='lastClassStudied'
                  placeholder='Last Class Studied'
                  value={newMember.madrassa.lastClassStudied}
                  onChange={(e) => handleMadrassaChange('lastClassStudied', e.target.value)}
                  className='block w-full border p-2 rounded-md shadow-sm sm:text-sm'
                />
                </div>
              )}
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <Label>
                  Education level
                </Label>
                <Select
                  name='education'
                  onValueChange={(value) => {
                    setNewMember((prev) => (
                      {
                        ...prev, education: {
                          level: value,
                          description: ''
                        }
                      }
                    ));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Below 10th">Below 10th</SelectItem>
                    <SelectItem value="SSLC">SSLC</SelectItem>
                    <SelectItem value="Plus Two">Plus Two</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Bachelors">Bachelors</SelectItem>
                    <SelectItem value="Masters">Masters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(newMember.education.level === 'Below 10th' ||
                newMember.education.level === 'Diploma' ||
                newMember.education.level === 'Bachelors' ||
                newMember.education.level === 'Masters') && (
                  <div>
                    <Label>
                      Education description
                    </Label>
                    <Input
                      name='educationDescription'
                      placeholder='Enter description'
                      value={newMember.education.description}
                      onChange={(e) =>
                        setNewMember((prev) => ({
                          ...prev,
                          education: {
                            ...prev.education,
                            description: e.target.value
                          }
                        }))
                      }
                    />
                  </div>
                )}
            </div>
                    <div>
                        <Input
                            type='tel'
                            name='mobile'
                            placeholder='Enter mobile number'
                            value={newMember.mobile}
                            onChange={handleChange}
                            className='block w-full border p-2 rounded-md shadow-sm  sm:text-sm'
                        />
                    </div>
                    <div>
              <Input
                type='tel'
                name='whatsappNumber'
                placeholder='Enter Whatsapp number'
                value={newMember.whatsappNumber}
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
                <div className='mt-4'>
                        <Button disabled={loading}
                         onClick={handleSubmit}>Create House</Button>
                </div>
            </div>
        </div>
    </div>)}</>
    )
}

export default Page
