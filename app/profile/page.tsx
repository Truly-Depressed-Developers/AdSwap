import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div>
      <h1>Twoje biznesy</h1>
      <Link href="/profile/create-business">Dodaj biznes</Link>
    </div>
  );
}
