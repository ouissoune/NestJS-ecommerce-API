import { UserType, UserPurpose } from 'src/utils/enums';
import { User } from 'src/utils/types';
export const productsTestAdmins: User[] = [
  {
    username: 'admin2',
    email: 'admin2@productstest.com',
    password: 'AdminPass2!',
    role: UserType.ADMIN,
    purpose: UserPurpose.PRODUCTS,
  },
  {
    username: 'admin5',
    email: 'admin5@productstest.com',
    password: 'AdminPass5!',
    role: UserType.ADMIN,
    purpose: UserPurpose.PRODUCTS,
  },
];

export const productsTestNormals: User[] = [
  {
    username: 'user2',
    email: 'user2@productstest.com',
    password: 'UserPass2!',
    role: UserType.NORMAL_USER,
    purpose: UserPurpose.PRODUCTS,
  },
  {
    username: 'user4',
    email: 'user4@productstest.com',
    password: 'UserPass4!',
    role: UserType.NORMAL_USER,
    purpose: UserPurpose.PRODUCTS,
  },
  {
    username: 'user8',
    email: 'user8@productstest.com',
    password: 'UserPass8!',
    role: UserType.NORMAL_USER,
    purpose: UserPurpose.PRODUCTS,
  },
  {
    username: 'user10',
    email: 'user10@productstest.com',
    password: 'UserPass10!',
    role: UserType.NORMAL_USER,
    purpose: UserPurpose.PRODUCTS,
  },
];

export const usersTestNormals: User[] = [
  {
    username: 'user1',
    email: 'user1@userstests.com',
    password: 'UserPass1!',
    role: UserType.NORMAL_USER,
    purpose: UserPurpose.USERS,
  },
  {
    username: 'user3',
    email: 'user3@userstests.com',
    password: 'UserPass3!',
    role: UserType.NORMAL_USER,
    purpose: UserPurpose.USERS,
  },
  {
    username: 'user5',
    email: 'user5@userstests.com',
    password: 'UserPass5!',
    role: UserType.NORMAL_USER,
    purpose: UserPurpose.USERS,
  },
  {
    username: 'user6',
    email: 'user6@userstests.com',
    password: 'UserPass6!',
    role: UserType.NORMAL_USER,
    purpose: UserPurpose.USERS,
  },
  {
    username: 'user7',
    email: 'user7@userstests.com',
    password: 'UserPass7!',
    role: UserType.NORMAL_USER,
    purpose: UserPurpose.USERS,
  },
  {
    username: 'user9',
    email: 'user9@userstests.com',
    password: 'UserPass9!',
    role: UserType.NORMAL_USER,
    purpose: UserPurpose.USERS,
  },
];

export const usersTestAdmins: User[] = [
  {
    username: 'admin1',
    email: 'admin1@userstests.com',
    password: 'AdminPass1!',
    role: UserType.ADMIN,
    purpose: UserPurpose.USERS,
  },
  {
    username: 'admin3',
    email: 'admin3@userstests.com',
    password: 'AdminPass3!',
    role: UserType.ADMIN,
    purpose: UserPurpose.USERS,
  },
  {
    username: 'admin4',
    email: 'admin4@userstests.com',
    password: 'AdminPass4!',
    role: UserType.ADMIN,
    purpose: UserPurpose.USERS,
  },
];

export const ordersTestAdmins: User[] = [
  {
    username: 'admin1',
    email: 'admin1@orderstest.com',
    password: 'AdminPass1!',
    role: UserType.ADMIN,
    purpose: UserPurpose.ORDERS,
  },
  {
    username: 'admin2',
    email: 'admin2@orderstest.com',
    password: 'AdminPass2!',
    role: UserType.ADMIN,
    purpose: UserPurpose.ORDERS,
  },
];

export const ordersTestNormals: User[] = [
  {
    username: 'user1',
    email: 'user1@orderstest.com',
    password: 'UserPass1!',
    role: UserType.NORMAL_USER,
    purpose: UserPurpose.ORDERS,
  },
  {
    username: 'user2',
    email: 'user2@orderstest.com',
    password: 'UserPass2!',
    role: UserType.NORMAL_USER,
    purpose: UserPurpose.ORDERS,
  },
  {
    username: 'user3',
    email: 'user3@orderstest.com',
    password: 'UserPass3!',
    role: UserType.NORMAL_USER,
    purpose: UserPurpose.ORDERS,
  },
];
