import { useRouter } from 'next/router';
import { useEffect } from 'react';
function Error() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  });
  return null;
}

export default Error;
