'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '@/components/Spinner';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MembersReport from '@/components/reports/MembersReport';

const Page = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [memberData, setMemberData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [dobFilter, setDobFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [maritalStatusFilter, setMaritalStatusFilter] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [educationFilter, setEducationFilter] = useState('');
  const [placeFilter, setPlaceFilter] = useState('');
  const [relationFilter, setRelationFilter] = useState('');

  // Helper function to calculate age
  const calculateAge = (dob:any) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  // Fetch member data on component mount
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/reports/get/members`); // Adjust the API URL as needed
        setMemberData(response.data.houseWithMembers);
        setFilteredData(response.data.houseWithMembers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching members:', error);
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Filter and search logic
  useEffect(() => {
    const applyFilters = () => {
      let data:any = memberData;

      if (search) {
        data = data.map((item: any) => ({
          ...item,
          members: item.members.filter((member: any) =>
            member.name.toLowerCase().includes(search.toLowerCase()) // Search by member name
          )
        })).filter((item: any) =>
          item.house.toLowerCase().includes(search.toLowerCase()) || // Search by house name
          item.houseNumber?.toLowerCase().includes(search.toLowerCase()) || // Search by house number
          item.members.length > 0 // Include houses with matching members
        );
      }

      // Filter by DOB ranges
      if (dobFilter) {
        data = data.map((item:any) => ({
          ...item,
          members: item.members.filter((member:any) => {
            const age = calculateAge(member.DOB);
            switch (dobFilter) {
              case 'below 10': return age < 10;
              case 'below 20': return age < 20;
              case 'below 30': return age < 30;
              case 'below 40': return age < 40;
              case 'below 50': return age < 50;
              case 'above 50': return age >= 50;
              default: return true;
            }
          })
        }));
      }

      // Filter by other attributes (gender, marital status, etc.)
      data = data.map((item:any)=> ({
        ...item,
        members: item.members.filter((member:any) => {
          return (
            (!genderFilter || member.gender === genderFilter) &&
            (!maritalStatusFilter || member.maritalStatus === maritalStatusFilter) &&
            (!bloodGroupFilter || member.bloodGroup === bloodGroupFilter) &&
            (!educationFilter || member.education.level === educationFilter) &&
            (!placeFilter || member.place === placeFilter) &&
            (!relationFilter || member.relation?.relationType === relationFilter)
          );
        })
      }));

      // Update filtered data
      setFilteredData(data);
    };

    applyFilters();
  }, [search, dobFilter, genderFilter, maritalStatusFilter, bloodGroupFilter, educationFilter, placeFilter, relationFilter, memberData]);

  return (
    <div className='w-full py-5 px-2'>
      <div className="mb-4 flex justify-between items-center">
          <Link href='/reports' className='bg-gray-900 text-white rounded-sm py-2 px-3 text-sm'>
            Back
          </Link>
        </div>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <Input
            type='text'
            placeholder='Search by member name'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='mb-4 p-1 border border-gray-300 bg-white rounded-md'
          />
<div className='my-2 md:space-y-0 grid grid-cols-2 md:grid-cols-6 md:gap-4 gap-2'>
  <select
    value={dobFilter}
    onChange={(e) => setDobFilter(e.target.value)}
    className='p-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  >
    <option value=''>Filter by Age</option>
    <option value='below 10'>Below 10</option>
    <option value='below 20'>Below 20</option>
    <option value='below 30'>Below 30</option>
    <option value='below 40'>Below 40</option>
    <option value='below 50'>Below 50</option>
    <option value='above 50'>Above 50</option>
  </select>

  {/* Gender Filter */}
  <select
    value={genderFilter}
    onChange={(e) => setGenderFilter(e.target.value)}
    className='p-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  >
    <option value=''>Filter by Gender</option>
    <option value='male'>Male</option>
    <option value='female'>Female</option>
  </select>

  {/* Marital Status Filter */}
  <select
    value={maritalStatusFilter}
    onChange={(e) => setMaritalStatusFilter(e.target.value)}
    className='p-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  >
    <option value=''>Filter by Marital Status</option>
    <option value='married'>Married</option>
    <option value='unmarried'>Unmarried</option>
    <option value='divorced'>Divorced</option>
  </select>

  {/* Blood Group Filter */}
  <select
    value={bloodGroupFilter}
    onChange={(e) => setBloodGroupFilter(e.target.value)}
    className='p-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  >
    <option value=''>Filter by Blood Group</option>
    <option value='A+'>A+</option>
    <option value='A-'>A-</option>
    <option value='B+'>B+</option>
    <option value='B-'>B-</option>
    <option value='AB+'>AB+</option>
    <option value='AB-'>AB-</option>
    <option value='O+'>O+</option>
    <option value='O-'>O-</option>
  </select>

  {/* Education Filter */}
  <select
    value={educationFilter}
    onChange={(e) => setEducationFilter(e.target.value)}
    className='p-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  >
    <option value=''>Filter by Education</option>
    <option value='Below 10th'>Below 10th</option>
    <option value='SSLC'>SSLC</option>
    <option value='Plus Two'>Plus Two</option>
    <option value='Diploma'>Diploma</option>
    <option value='Bachelors'>Bachelors</option>
    <option value='Masters'>Masters</option>
    <option value='PhD'>PhD</option>
  </select>
  <select
    value={educationFilter}
    onChange={(e) => setEducationFilter(e.target.value)}
    className='p-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  >
    <option value=''>Filter by Madrassa</option>
    <option value='Not studied'>Not studied</option>
    <option value='Below 5th'>Below 5th</option>
    <option value='Above 5th'>Above 5th</option>
    <option value='Above 10th'>Above 10th</option>
  </select>

  {/* Place Filter */}
  <select
    value={placeFilter}
    onChange={(e) => setPlaceFilter(e.target.value)}
    className='p-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  >
    <option value=''>Filter by Place</option>
    <option value='Kerala'>Kerala</option>
    <option value='UAE'>UAE</option>
    <option value='Malaysia'>Malaysia</option>
    <option value='Singapore'>Singapore</option>
    <option value='Kuwait'>Kuwait</option>
    <option value='Saudi'>Saudi</option>
    <option value='Oman'>Oman</option>
    <option value='Qatar'>Qatar</option>
    <option value='Outside Kerala'>Outside Kerala</option>
  </select>

  {/* Relation Filter */}
  <select
    value={relationFilter}
    onChange={(e) => setRelationFilter(e.target.value)}
    className='p-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  >
    <option value=''>Filter by Relation</option>
    <option value='Son in law'>Son in law</option>
    <option value='Daughter in law'>Daughter in law</option>
  </select>
<MembersReport data={filteredData}/>
</div>


{filteredData.map((house: any, index: number) => (
  house.members.length > 0 && (
    <div key={index} className='mb-8 p-4 border border-gray-300 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-3'>{house.house}</h2>
      <p className='text-gray-700 mb-2'>House Number: <span className='font-semibold'>{house.houseNumber}</span></p>
      <p className='text-gray-700 mb-4'>Total Members: <span className='font-semibold'>{house.totalMembers}</span></p>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Number</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Age</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Gender</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Marital Status</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Blood Group</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Education</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Place</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {house.members.map((member: any) => (
              <tr key={member._id}>
                <td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{member.name}</td>
                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>{member.status}</td>
                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>{member?.mobile || 'NIL'}</td>
                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>{calculateAge(member.DOB)}</td>
                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>{member.gender}</td>
                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>{member.maritalStatus}</td>
                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>{member.bloodGroup}</td>
                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>{member.education.level}</td>
                <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>{member.place}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
))}



        </div>
      )}
    </div>
  );
};

export default Page;
