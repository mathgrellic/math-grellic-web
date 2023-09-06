import dayjs from 'dayjs';
import { UserRole } from '#/user/models/user.model';

import type {
  StudentUserAccount,
  TeacherUserAccount,
  User,
} from '#/user/models/user.model';

export function transformToUser({
  id,
  createdAt,
  updatedAt,
  supabaseUserId,
  publicId,
  role,
  email,
  profileImageUrl,
  approvalStatus,
  approvalDate,
  userAccount: userAccountData,
}: any): User {
  // TODO admin
  const userAccount =
    role === UserRole.Teacher
      ? transformToTeacherUserAccount(userAccountData)
      : transformToStudentUserAccount(userAccountData);

  return {
    id,
    createdAt: dayjs(createdAt).toDate(),
    updatedAt: dayjs(updatedAt).toDate(),
    supabaseUserId,
    publicId,
    role,
    email,
    profileImageUrl,
    approvalStatus,
    approvalDate: approvalDate ? dayjs(approvalDate).toDate() : null,
    userAccount,
  };
}

export function transformToTeacherUserAccount({
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  educationalBackground,
  teachingExperience,
  teachingCertifications,
  website,
  socialMediaLinks,
  emails,
}: any): TeacherUserAccount {
  return {
    firstName,
    lastName,
    middleName,
    birthDate: dayjs(birthDate).toDate(),
    phoneNumber,
    gender,
    aboutMe,
    educationalBackground,
    teachingExperience,
    teachingCertifications,
    website,
    socialMediaLinks,
    emails,
    //  students,
  } as TeacherUserAccount;
}

export function transformToStudentUserAccount({
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  teacherId,
}: any): StudentUserAccount {
  return {
    firstName,
    lastName,
    middleName,
    birthDate: dayjs(birthDate).toDate(),
    phoneNumber,
    gender,
    aboutMe,
    teacherId,
  } as StudentUserAccount;
}

export function transformToTeacherUserDto({
  email,
  password,
  approvalStatus,
  profileImageUrl,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  educationalBackground,
  teachingExperience,
  teachingCertifications,
  website,
  socialMediaLinks,
  emails,
}: any) {
  return {
    email,
    password,
    approvalStatus,
    profileImageUrl,
    firstName,
    lastName,
    middleName,
    birthDate,
    phoneNumber: phoneNumber.replace(/\D/g, ''),
    gender,
    aboutMe,
    educationalBackground,
    teachingExperience,
    teachingCertifications,
    website,
    socialMediaLinks,
    emails,
  };
}

export function transformToStudentUserDto({
  email,
  password,
  approvalStatus,
  profileImageUrl,
  firstName,
  lastName,
  middleName,
  birthDate,
  phoneNumber,
  gender,
  aboutMe,
  teacherId,
}: any) {
  return {
    email,
    password,
    approvalStatus,
    profileImageUrl,
    firstName,
    lastName,
    middleName,
    birthDate,
    phoneNumber: phoneNumber.replace(/\D/g, ''),
    gender,
    aboutMe,
    teacherId: teacherId ? teacherId.toUpperCase() : undefined,
  };
}