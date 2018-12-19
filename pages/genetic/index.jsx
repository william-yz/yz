import dynamic from 'next/dynamic';

const Draw = dynamic(() => import('../../client/genetic/Draw'), {
  ssr: false,
});

export default () => (
  <>
    <Draw />
  </>
);
