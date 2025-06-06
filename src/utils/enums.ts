export enum UserType {
  ADMIN = 'admin',
  NORMAL_USER = 'normal_user',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  DELIVERED = 'delivered',
}

export enum Period {
  TODAY = 'today',
  //THIS_WEEK = 'this_week',
  THIS_MONTH = 'this_month',
  THIS_YEAR = 'this_year',
  //ALL_TIME = 'all_time',
}

export enum UserPurpose {
  USERS = 'users',
  PRODUCTS = 'products',
  ORDERS = 'orders',
}
