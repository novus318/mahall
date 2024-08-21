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

interface PageProps {
  params: {
    pid: string
  }
}

interface Member {
  _id: string,
  name: string
  status: string,
  DOB: Date,
  maritalStatus: string
  education: string,
  gender:string,
  mobile: string,
  house:string

  // Add other fields as needed
}

const PageComponent = ({ params }: PageProps) => {
  const { pid } = params
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [members, setMembers] = useState<Member[]>([])
  const [newMember, setNewMember] = useState<Member>({
    _id: '',
    name: '',
    status: '',
    DOB: new Date(),
    maritalStatus: '',
    gender:'',
    education: '',
    mobile: '',
    house: ''
  })
  const [selectedRelation, setSelectedRelation] = useState({ memberId: '',name:'', relation: '' })

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
        if(response.data.success){
         setNewMember({
          _id: response.data.member._id,
          name: response.data.member.name,
          status: response.data.member.status,
          DOB: new Date(response.data.member.DOB),
          maritalStatus: response.data.member.maritalStatus,
          gender: response.data.member.gender,
          education: response.data.member.education,
          mobile: response.data.member.mobile,
          house: response.data.member.house._id,
         })
      if(response.data.member.relation){
        setSelectedRelation({
          memberId: response.data.member.relation.member._id,
          name: response.data.member.relation.member.name,
          relation: response.data.member.relation.relationType
         })
      }
        setMembers(response.data.members)
        console.log(response.data.members)
        }
      })
      .catch(error => {
        console.error("Error fetching members:", error)
      })
  }, [pid])

  // Handle form submission for creating a new member
  const handleEditMember = async() => {
   try {
    const data = {
      newMember,
      selectedRelation,
      houseId: newMember.house,
      memberId:newMember._id
    }
    const response = await axios.put(`${apiUrl}/api/member/edit-member`, data)
    if (response.data.success) {
      router.push(`/house-details/${newMember?.house}`);
      setNewMember({
        _id:'',
        name: '',
        status: '',
        DOB: new Date(),
        maritalStatus: '',
        gender:'',
        education: '',
        mobile: '',
        house:'',
      })
      setSelectedRelation({ memberId: '',name:'', relation: '' })
   }
  } catch (error) {
    
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
        <Link href={`/house/house-details/${newMember?.house}`} className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
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
              className=' block w-full border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>


          <div className='grid grid-cols-2 gap-2'>
            <Input
              type='text'
              name='status'
              placeholder='Current occupation'
              value={newMember.status}
              onChange={handleChange}
              className=' block w-full border px-2 py-4 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
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
                    male
                  </SelectItem>
                  <SelectItem value='female'>
                    female
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
                  <SelectValue placeholder={newMember.maritalStatus || 'status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='maried'>
                    married
                  </SelectItem>
                  <SelectItem value='unmarried'>
                    unmarried
                  </SelectItem>
                  <SelectItem value='divorced'>
                    divorced
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Input
              type='text'
              name='education'
              placeholder='Enter education'
              value={newMember.education}
              onChange={handleChange}
              className=' block w-full border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
          </div>

          <div>
            <Input
              type='tel'
              name='mobile'
              placeholder='Enter mobile number'
              value={newMember.mobile}
              onChange={handleChange}
              className=' block w-full border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            />
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
                  <SelectValue placeholder={selectedRelation?.name || 'member'} />
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
                  <SelectValue placeholder={selectedRelation?.relation || 'relation'} />
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
            className='w-full'
            onClick={handleEditMember}
          >
            Add Member
          </Button>
     </div>
    </div>
  )
}

export default PageComponent