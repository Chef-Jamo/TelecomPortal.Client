import { CustomerAccountDisplay } from "../features/CustomerAccountDisplay";

function Home() {
  return (
    <>
      <main className='flex-grow p-4'>
        <CustomerAccountDisplay />
      </main>
    </>
  );
}

export default Home;
