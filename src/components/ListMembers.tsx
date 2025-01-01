'use client'
import React, { useState } from 'react';
import { ArrowDownIcon, ArrowRightIcon, ArrowLeftIcon } from 'lucide-react'; // Updated to lucide-react
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from './ui/button';
const ListMembers = ({ members, familyHead }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const filteredMembers = members?.filter((member: any) => member?._id !== familyHead?._id);

  // Separate members into those with relations and those without
  const membersWithRelations = filteredMembers?.filter((member: any) => member?.relation);
  const membersWithoutRelations = filteredMembers?.filter((member: any) => !member?.relation);

  return (
    <div className="flex flex-col items-center space-y-8 p-2 md:p-8 bg-background rounded-lg border mx-auto max-w-5xl">
      <h1 className="text-xl font-bold text-primary">Family Tree</h1>
      <div className="flex flex-col items-center space-y-4">
        <div
         onClick={
          () => {
            setIsOpen(true)
            setSelectedMember(familyHead)
          }} className="flex cursor-pointer items-center justify-center w-52 bg-primary text-primary-foreground rounded-md font-semibold text-lg shadow-lg py-2">
          <div className="text-center">
            <div className="text-sm">{familyHead?.name}</div>
            <div className="text-xs mt-1">{familyHead?.status|| 'Occupation not specified'}</div>
          </div>
        </div>
        <ArrowDownIcon className="w-10 h-10 text-muted-foreground animate-bounce" />
      </div>

      <div className="flex flex-col space-y-6 md:space-y-8 w-full">
        {membersWithRelations?.map((member: any, index: any) => (
          <div key={member._id} className="flex flex-row items-center justify-between space-y-1 md:space-y-0 md:space-x-8 w-full">
            <div
             onClick={
              () => {
                setIsOpen(true)
                setSelectedMember(member.relation.member)
              }} className="flex items-center cursor-pointer justify-center w-full px-1 md:w-52 py-2 bg-gray-200 text-card-foreground rounded-md font-semibold text-lg shadow-lg">
              <div className="text-center">
                <div className="text-sm">{member.relation.member?.name}</div>
                <div className="text-xs mt-1">{member.relation.member?.status || 'Occupation not specified'}</div>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-4">
              {member.relation.relationType === 'husband' ? (
                <>
                  <span className="text-muted-foreground font-medium text-sm md:text-base">Husband</span>
                  <ArrowRightIcon className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground animate-pulse" />
                </>
              ) : (
                <>
                  <span className="text-muted-foreground font-medium text-sm md:text-base">
                    {member.relation.relationType.charAt(0).toUpperCase() + member.relation.relationType.slice(1)}
                  </span>
                  <ArrowRightIcon className=" text-muted-foreground animate-pulse w-6 h-6 md:w-8 md:h-8 " />
                </>
              )}
            </div>
            <div
             onClick={
              () => {
                setIsOpen(true)
                setSelectedMember(member)
              }} className="flex cursor-pointer items-center justify-center w-full px-1 md:w-52 py-2 bg-gray-200 text-card-foreground rounded-md font-semibold text-lg shadow-lg">
              <div className="text-center">
                <div className="text-sm">{member.name}</div>
                <div className="text-xs mt-1">{member?.status || 'Occupation not specified'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Members without Relations */}
      {membersWithoutRelations?.length > 0 && (
        <div className="flex flex-col space-y-8">
          {membersWithoutRelations?.map((member: any, index: any) => (
            <div
            onClick={
              () => {
                setIsOpen(true)
                setSelectedMember(member)
              }} key={index} className="flex cursor-pointer items-center justify-center w-52 md:w-52 py-2 bg-gray-200 text-card-foreground rounded-md font-semibold text-lg shadow-lg">
              <div className="text-center">
                <div className="text-sm">{member.name}</div>
                <div className="text-xs mt-1">{member?.status || 'Occupation not specified'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={isOpen} onOpenChange={(v) => {
      if (!v) {
        setIsOpen(v);
      }
    }}>
        <DialogContent className='px-3 rounded-md'>
        <DialogTitle className="text-xl font-semibold mb-4">User Details</DialogTitle>
        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="font-medium">Name:</span>
            <span>{selectedMember?.name}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Date of Birth:</span>
            <span>{selectedMember?.DOB && format(selectedMember.DOB, "PPP")}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Gender:</span>
            <span>{selectedMember?.gender}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Mobile:</span>
            <span>{selectedMember?.mobile || 'Not found'}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Whatsapp number:</span>
            <span>{selectedMember?.whatsappNumber || 'Not found'}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Blood group:</span>
            <span>{selectedMember?.bloodGroup || 'Not found'}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Education:</span>
            <span>{selectedMember?.education?.level} / {selectedMember?.education?.description}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Madrassa:</span>
            <span>{selectedMember?.madrassa?.level} / {selectedMember?.madrassa?.description}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Marital Status:</span>
            <span>{selectedMember?.maritalStatus}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Current ocupation:</span>
            <span>{selectedMember?.status}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">Place:</span>
            <span>{selectedMember?.place}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium">ID Cards:</span>
           <div>
           <span>Aadhaar - {selectedMember?.idCards?.aadhaar ? 'Yes': 'No'}</span><br/>
            <span>Driving License - {selectedMember?.idCards?.drivingLicense? 'Yes': 'No'}</span><br />
            <span>Voter ID - {selectedMember?.idCards?.voterID? 'Yes': 'No'}</span><br />
            <span>Pan Card - {selectedMember?.idCards?.panCard? 'Yes': 'No'}</span><br />
            <span>Health Card - {selectedMember?.idCards?.HealthCard? 'Yes': 'No'}</span>
           </div>
          </div>
         <div className='flex justify-center'>
         <Link className='bg-gray-900 text-white font-medium py-1 px-3 rounded-md' href={`/house/edit-member/${selectedMember?._id}`}>
         Edit</Link>
         </div>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default ListMembers;
