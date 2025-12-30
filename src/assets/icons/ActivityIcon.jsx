import * as React from "react";

const ActivityIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 32}
    height={props.size || 32}
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <rect width={32} height={32} fill="#635ED4" rx={8} />
    <path
      fill="#fff"
      d="M21.505 14.369c1.385.646 1.385 2.616 0 3.262l-8.944 4.174A1.8 1.8 0 0 1 10 20.174v-8.348a1.8 1.8 0 0 1 2.561-1.63z"
    />
  </svg>
);

export default ActivityIcon;