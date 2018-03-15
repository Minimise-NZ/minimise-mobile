
export default [
  /*
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index') }
    ]
  },
  */
  {
    path: '/',
    component: () => import('pages/Welcome')
  },
  {
    path: '/login',
    component: () => import('pages/Login')
  },
  {
    path: '/signup',
    component: () => import('pages/SignUp')
  },
  {
    path: '/location',
    component: () => import('pages/Location')
  },
  {
    path: '/hazards',
    component: () => import('pages/Hazards')
  },
  {
    path: '/home',
    component: () => import('layouts/default'),
    children: [
      {
        path: '/',
        component: () => import('pages/SafetyPlan')
      },
      {
        path: 'emergency',
        component: () => import('pages/EmergencyInfo')
      },
      {
        path: 'hazardRegister',
        component: () => import('pages/HazardRegister')
      },
      {
        path: 'incident',
        component: () => import('pages/Incident')
      }
    ]
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
