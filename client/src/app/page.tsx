// 'use client';
import axios from '@/lib/axios';
import Home from './(components)/home';
// import { fetchBooks } from '@/lib/store/bookSlice';
// export async function getStaticProps(){
//   const res = await axios.get(`/book/getAll`)
//   const books = res.data;
//   return {
//     props: {
//       books,
//     }
//   }
// } 
const HomePage = async () => {
  const res = await axios.get(`/book/getAll`)
  const listBook = res.data
  console.log('from page.tsx')
  return (
    <div>
      <Home listBook={listBook ? listBook : []} />
    </div>
  )
};
export default HomePage;
