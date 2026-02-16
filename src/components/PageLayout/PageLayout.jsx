import React from 'react'

import SubjectDropdown from '@/components/Subjects/SubjectDropdown'
import TabTitle from '@/components/TabTitle/TabTitle'

const PageLayout = ({ trailing, children, subtitle }) => {
  return (
    <>
      <TabTitle trailing={trailing}>
        <SubjectDropdown />
        {subtitle}
      </TabTitle>
      {children}
    </>
  )
}

export default PageLayout
