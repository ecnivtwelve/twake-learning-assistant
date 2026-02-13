import * as React from 'react'
const ActivityIcon = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 32}
    height={props.size || 32}
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      fill="#EFEFFF"
      stroke="#635ED4"
      strokeWidth={2}
      d="M8 1h11.584l9.816 9.814V25.6A5.4 5.4 0 0 1 24 31H8a5.4 5.4 0 0 1-5.4-5.4V6.4A5.4 5.4 0 0 1 8 1Z"
    />
    <path
      fill="#635ED4"
      d="M14.593 25.005c.859.42 1.864.42 2.723 0l6.392-3.122h.004V31H8.197v-9.117H8.2z"
    />
    <path
      fill="#444095"
      d="m19.617 16.032-3.663 1.796-3.656-1.804 2.837-4.053a1 1 0 0 1 1.639 0z"
    />
    <path
      fill="#A399E2"
      d="m12.298 16.024 3.656 1.804 3.663-1.796 4.095 5.851h-.004l-6.392 3.122c-.86.42-1.864.42-2.723 0L8.2 21.883h-.003z"
    />
    <path
      fill="#635ED4"
      d="M30.4 10.8 19.6 0v5.586c0 2.88 2.256 5.214 5.04 5.214z"
    />
  </svg>
)
export default ActivityIcon
