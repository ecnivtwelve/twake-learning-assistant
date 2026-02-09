import React from 'react'

import SubjectDropdown from '@/components/Subjects/SubjectDropdown'
import TabTitle from '@/components/TabTitle/TabTitle'

const PageLayout = ({ trailing, children }) => {
  return (
    <>
      <TabTitle trailing={trailing}>
        <SubjectDropdown />
      </TabTitle>
      {children}
    </>
  )
}

export default PageLayout
