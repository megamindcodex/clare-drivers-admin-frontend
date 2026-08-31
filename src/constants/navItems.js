import {
  IconOverView,
  IconAdmin,
  IconActiveDrivers,
  IconDrivers,
  IconActivityLogs,
} from '@/components/icons'

export const navItems = [
  { name: 'Overview', path: '/', matches: ['overview'], icon: IconOverView },
  {
    name: 'Drivers',
    path: '/drivers',
    matches: ['drivers', 'driver-detail'],
    icon: IconDrivers,
  },
  {
    name: 'Active Drivers',
    path: '/drivers/active',
    matches: ['active-drivers', 'active-driver-detail'],
    icon: IconActiveDrivers,
  },
  { name: 'Admins', path: '/admins', matches: ['admins'], icon: IconAdmin, roles: ['SuperAdmin'] },
  {
    name: 'Activity Logs',
    path: '/logs',
    matches: ['activity-logs'],
    icon: IconActivityLogs,
  },
]
