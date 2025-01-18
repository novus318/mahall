'use client';
import React, { useState } from 'react';
import { ArrowDownIcon, ArrowRightIcon } from 'lucide-react'; // Updated to lucide-react
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const ListMembers = ({ members, familyHead }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const filteredMembers = members?.filter((member: any) => member?._id !== familyHead?._id);

  // Separate members into those with relations and those without
  const membersWithRelations = filteredMembers?.filter((member: any) => member?.relation);
  const membersWithoutRelations = filteredMembers?.filter((member: any) => !member?.relation);

  return (
    <div className="flex flex-col items-center space-y-8 p-4 md:p-8 bg-white rounded-lg border border-gray-200 shadow-sm mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-900">Family Tree</h1>
      <div className="flex flex-col items-center space-y-4">
        <div
          onClick={() => {
            setIsOpen(true);
            setSelectedMember(familyHead);
          }}
          className="flex cursor-pointer items-center justify-center w-52 bg-primary text-white rounded-lg font-semibold text-lg shadow-lg py-3 hover:bg-primary/80 transition-colors"
        >
          <div className="text-center">
            <div className="text-sm">{familyHead?.name}</div>
            <div className="text-xs mt-1 text-gray-100">{familyHead?.status || 'Occupation not specified'}</div>
          </div>
        </div>
        <ArrowDownIcon className="w-10 h-10 text-gray-400 animate-bounce" />
      </div>

      <div className="flex flex-col space-y-6 md:space-y-8">
        {membersWithRelations?.map((member: any, index: any) => (
          <div key={member._id} className="flex flex-row items-center justify-between space-y-1 md:space-y-0 md:space-x-8 w-full">
            <div
              onClick={() => {
                setIsOpen(true);
                setSelectedMember(member.relation.member);
              }}
              className="flex items-center cursor-pointer justify-center w-full px-1 md:w-52 py-2 bg-gray-100 text-gray-900 rounded-lg font-semibold text-lg shadow-md hover:bg-gray-200 transition-colors"
            >
              <div className="text-center">
                <div className="text-sm">{member.relation.member?.name}</div>
                <div className="text-xs mt-1 text-gray-600">{member.relation.member?.status || 'Occupation not specified'}</div>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-4">
              {member.relation.relationType === 'husband' ? (
                <>
                  <span className="text-gray-600 font-medium text-sm md:text-base">Husband</span>
                  <ArrowRightIcon className="w-6 h-6 md:w-8 md:h-8 text-gray-600 animate-pulse" />
                </>
              ) : (
                <>
                  <span className="text-gray-600 font-medium text-sm md:text-base">
                    {member.relation.relationType.charAt(0).toUpperCase() + member.relation.relationType.slice(1)}
                  </span>
                  <ArrowRightIcon className="text-gray-600 animate-pulse w-6 h-6 md:w-8 md:h-8" />
                </>
              )}
            </div>
            <div
              onClick={() => {
                setIsOpen(true);
                setSelectedMember(member);
              }}
              className="flex cursor-pointer items-center justify-center w-full px-1 md:w-52 py-2 bg-gray-100 text-gray-900 rounded-lg font-semibold text-lg shadow-md hover:bg-gray-200 transition-colors"
            >
              <div className="text-center">
                <div className="text-sm">{member.name}</div>
                <div className="text-xs mt-1 text-gray-600">{member?.status || 'Occupation not specified'}</div>
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
              onClick={() => {
                setIsOpen(true);
                setSelectedMember(member);
              }}
              key={index}
              className="flex cursor-pointer items-center justify-center w-52 md:w-52 py-2 bg-gray-100 text-gray-900 rounded-lg font-semibold text-lg shadow-md hover:bg-gray-200 transition-colors"
            >
              <div className="text-center">
                <div className="text-sm">{member.name}</div>
                <div className="text-xs mt-1 text-gray-600">{member?.status || 'Occupation not specified'}</div>
              </div>
            </div>
          ))}
        </div>
      )}

<Dialog open={isOpen} onOpenChange={(v) => !v && setIsOpen(v)}>
  <DialogContent className="rounded-lg max-w-md p-0 overflow-hidden">
    <DialogTitle className="text-2xl font-bold text-gray-900 p-6 border-b border-gray-200">
      User Details
    </DialogTitle>
    <ScrollArea className="h-[60vh] px-6">
      <div className="space-y-4 py-4">
        <div className="flex gap-2">
          <span className="font-medium text-gray-600">Name:</span>
          <span className="text-gray-900">{selectedMember?.name}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-gray-600">Date of Birth:</span>
          <span className="text-gray-900">
            {selectedMember?.DOB && format(selectedMember.DOB, "PPP")}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-gray-600">Gender:</span>
          <span className="text-gray-900">{selectedMember?.gender}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-gray-600">Mobile:</span>
          <span className="text-gray-900">{selectedMember?.mobile || 'Not found'}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-gray-600">Whatsapp number:</span>
          <span className="text-gray-900">{selectedMember?.whatsappNumber || 'Not found'}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-gray-600">Blood group:</span>
          <span className="text-gray-900">{selectedMember?.bloodGroup || 'Not found'}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-gray-600">Education:</span>
          <span className="text-gray-900">
            {selectedMember?.education?.level} / {selectedMember?.education?.description}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-gray-600">Madrassa:</span>
          <span className="text-gray-900">
            {selectedMember?.madrassa?.level} / {selectedMember?.madrassa?.description}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-gray-600">Marital Status:</span>
          <span className="text-gray-900">{selectedMember?.maritalStatus}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-gray-600">Current occupation:</span>
          <span className="text-gray-900">{selectedMember?.status}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-gray-600">Place:</span>
          <span className="text-gray-900">{selectedMember?.place}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-medium text-gray-600">ID Cards:</span>
          <div className="text-gray-900 text-left">
            <span>Aadhaar - {selectedMember?.idCards?.aadhaar ? 'Yes' : 'No'}</span>
            <br />
            <span>Driving License - {selectedMember?.idCards?.drivingLicense ? 'Yes' : 'No'}</span>
            <br />
            <span>Voter ID - {selectedMember?.idCards?.voterID ? 'Yes' : 'No'}</span>
            <br />
            <span>Pan Card - {selectedMember?.idCards?.panCard ? 'Yes' : 'No'}</span>
            <br />
            <span>Health Card - {selectedMember?.idCards?.HealthCard ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </ScrollArea>
    <div className="flex justify-center p-6 border-t border-gray-200">
      <Link
        href={`/house/edit-member/${selectedMember?._id}`}
        className="bg-gray-900 text-white font-medium py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Edit
      </Link>
    </div>
  </DialogContent>
</Dialog>
    </div>
  );
};

export default ListMembers;