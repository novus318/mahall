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
import { toast } from '@/components/ui/use-toast'
import Spinner from '@/components/Spinner'
import { RadioGroup,RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2 } from 'lucide-react'


interface PageProps {
  params: {
    pid: string
  }
}

interface Member {
  _id:string,
  name: string,
  house:string,
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
    HealthCard:boolean,
  },
}

const PageComponent = ({ params }: PageProps) => {
  const { pid } = params
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false);
  const [newMember, setNewMember] = useState<Member>({
    _id: '',
    name: '',
    house: '',
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
      HealthCard:false,
    },
  })
  const [selectedRelation, setSelectedRelation] = useState({ memberId: '', name: '', relation: '' })

  const handleRelationChange = (field: string, value: string) => {
    setSelectedRelation(prevState => ({
      ...prevState,
      [field]: value
    }))
  }
  // Fetch members on component mount
  useEffect(() => {
    axios.get(`${apiUrl}/api/member/get-byId/${pid}`)
      .then(response => {
        if (response.data.success) {
          setNewMember({
            _id: response.data.member._id,
            name: response.data.member.name,
            house: response.data.member.house._id,
            status: response.data.member.status,
            DOB: new Date(response.data.member.DOB),
            maritalStatus: response.data.member.maritalStatus,
            education: {
              level: response.data.member.education.level,
              description: response.data.member.education?.description
            },
            bloodGroup: response.data.member.bloodGroup,
            madrassa: {
              studying: response.data.member.madrassa.studying,
              currentClass: response.data.member.madrassa.currentClass,
              lastClassStudied: response.data.member.madrassa.lastClassStudied
            },
            gender: response.data.member.gender,
            mobile: response.data.member.mobile,
            whatsappNumber: response.data.member.whatsappNumber,
            place: response.data.member.place,
            idCards: response.data.member.idCards
          })
          if (response.data.member.relation) {
            setSelectedRelation({
              memberId: response.data.member.relation.member._id,
              name: response.data.member.relation.member.name,
              relation: response.data.member.relation.relationType
            })
          }
          setMembers(response.data.members)
        }
      })
      .catch(error => {
        router.push('/house')
      })
  }, [pid])

  // Handle form submission for creating a new member
  const handleEditMember = async () => {
    setLoading(true)
    try {
      const data = {
        newMember,
        selectedRelation,
        houseId: newMember.house,
        memberId: newMember._id
      }
      const response = await axios.put(`${apiUrl}/api/member/edit-member`, data)
      if (response.data.success) {
        router.push(`/house/house-details/${newMember?.house}`);
        setNewMember({
          _id: '',
          name: '',
          house: '',
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
            HealthCard:false,
          },
        })
        setSelectedRelation({ memberId: '', name: '', relation: '' })
        setLoading(false)
      }
    } catch (error: any) {
      toast({
        title: "Error editing member",
        description: error?.response?.data?.message || error.message || 'Something went wrong',
        variant: "destructive",
      });
      setLoading(false)
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

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className='p-2'>
      <div className='max-w-5xl mx-auto'>
        <div className="mb-4 flex justify-between items-center">
          <Link href={`/house/house-details/${newMember.house}`} className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
            Back
          </Link>
        </div>

        <div className='mx-auto p-4 bg-white rounded-md border my-8'>
          <h2 className='text-2xl font-semibold mb-4'>Edit Member</h2>
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
                  <SelectValue placeholder={newMember?.gender} />
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
                    <SelectValue placeholder={newMember?.maritalStatus} />
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
            <div>
              <p className='text-sm'>Health Card</p>
              <RadioGroup
              className='flex'
                value={newMember.idCards.HealthCard ? 'yes' : 'no'}
                onValueChange={(value) => handleIdCardChange('HealthCard', value === 'yes')}
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
                  <SelectValue placeholder={newMember?.bloodGroup} />
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
                  <SelectValue placeholder={newMember?.madrassa?.studying  ? 'Yes' : 'No'} />
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
                    <SelectValue placeholder={newMember?.education?.level} />
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
                className=' block w-full border p-2 rounded-md shadow-sm  sm:text-sm'
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
                  <SelectValue placeholder={newMember?.place} />
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
                    <SelectValue placeholder={selectedRelation?.name|| 'No relation'} />
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
                    <SelectValue placeholder={selectedRelation?.relation || 'No Relation'} />
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
          onClick={handleEditMember}
        >
          {loading ? <Loader2 className='animate-spin'/> :'Add Member'}
        </Button>
      </div>
    </div>
      )}</>
  )
}

export default PageComponent
