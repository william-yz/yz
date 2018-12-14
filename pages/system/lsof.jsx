import dynamic from 'next/dynamic';
import Head from '../../components/common/Head';

const Kill = dynamic(() => import('../../client/system/Lsof'), {
  ssr: false,
});

export default () => (
  <>
    <Head />
    <Kill />
  </>
);
