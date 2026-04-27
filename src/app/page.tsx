import { redirect } from 'next/navigation';
export default function Home({}) {
  redirect('/admin/default');
}
// export default async function Home() {

//   const res = await fetch(
//     "https://jsonplaceholder.typicode.com/posts",
//     {
//       cache: "no-store", // SSR
//     }
//   );

//   const data = await res.json();

//   return (
//     <div>
//       <h1>SSR Page (App Router)</h1>

//       {data.slice(0,5).map((post:any) => (
//         <p key={post.id}>{post.title}</p>
//       ))}
//     </div>
//   );
// }