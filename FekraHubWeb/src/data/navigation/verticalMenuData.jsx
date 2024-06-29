const verticalMenuData = (dictionary, params) => [
  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboards,
    icon: 'ri-home-smile-line',
    children: [
      // This is how you will normally render menu item
      {
        label: dictionary['navigation'].crm,
        icon: 'ri-circle-line',
        href: '/dashboards/crm'
      }
    ]
  },

  // This is how you will normally render menu section
  {
    label: dictionary['navigation'].Pages,
    isSection: true,
    children: [
      {
        label: dictionary['navigation'].parents,
        icon: 'ri-checkbox-multiple-line',
        href: '/parents/form-validation'
      }
    ]
  }
]

export default verticalMenuData
