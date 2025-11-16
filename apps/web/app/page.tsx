
import prisma from '@repo/db/client';


export default async function Home() {
  const user = await prisma.user.findFirst();
  
  return (
    <div>
      {user ? (
        <p>Welcome back, {user.username}</p>
      ) : (
        <p>Please sign in.</p>
      )}
    </div>
  );
}

