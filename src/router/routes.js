
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
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
