import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { useState } from 'react';
import CustomInput from '../components/Input/Input';
import { Button, Heading, Text } from '@chakra-ui/react';
import Dropdown from '../components/Dropdown/Dropdown';

export default function Home() {
  const [id, setId] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [unsigE, setUnsigE] = useState([]);
  console.log(unsigE);

  const options = [
    {label: 'unsigned_algorithms',
      id: '0e14267a8020229adc0184dd25fa3174c3f7d6caadcb4425c70e7c04',
      value: 0
    },
    {label: 'Space Buds',
      id: 'd5e6bf0500378d4f0da4e8dde6becec7621cd8cbf5cbb9b87013d4cc',
      value: 1
    },
    {label: 'Crypto Knitties',
      id: '9bee44c5c494dee38622e6da0b3b312820f9f75dd6cc256c769db788',
      value: 2
    },
    {
      label: 'Clay Mates',
      id: 'c8e5bbe82b0431ff26c3b8480cfafe7569fd2a20128b16d05694276f',
      value: 3
    },
    {
      label: 'Ada monsterz',
      id: '',
      value: 4
    },
    {
      label: '',
      id: '',
      value: 5
    }

  ]

  const handleClear = () => {
    setUnsigE([]);
  };

  const handleDropdownChange = (value) => {
    setPolicyId(options[value].id)
  }; 

  const handleValueChange = (stateToChange, value) => {
    if(stateToChange === 'policyId') {
      setPolicyId(value);
    }
    if( stateToChange === 'id')
    setId(value)
  };
 const handleTestLog = async (id, policyId) => {
   setUnsigE([]);
    try {
      const response = await axios.get(`/api/v1/history/${policyId}?id=${id}`);
      setUnsigE(response.data);
    } catch (error) {
      console.error(error);
  }
 }
  return (
    <div>
      <Head>
        <title>CNFT Transactions</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <div>
            <Heading margin="10">CNFT Transactions</Heading>
          </div>
          <div>
        {unsigE?.assetImage && 
            <Image src={`https://ipfs.io/ipfs/${unsigE.assetImage.replace('ipfs://', '')}`} alt={'asset image'} width={500} height={500}/>
          } 
          {unsigE?.altImage && 
            <Image src={`https://ipfs.io/ipfs/${unsigE.altImage}`} alt={'alt image'} width={500} height={500}/>
          }
        </div>
          <div>
            <Dropdown options={options} label="Common Policies"
              onChange={(e) => handleDropdownChange(e.target.value)}
            />
            <CustomInput type={"text"} onChange={(e) => handleValueChange('policyId', e.target.value)} value={policyId} label="Policy ID"/>
            <CustomInput type={"text"} onChange={(e) => handleValueChange('id', e.target.value)} value={id} label="NFT ID"/>
          <Button onClick={() => handleTestLog(id, policyId)}>Search</Button>
          {unsigE?.lasttxs?.length > 1 && 
              <Button onClick={handleClear}> Clear</Button>
          }
          </div>  
          {unsigE?.lasttxs?.length > 1 && 
          <>
          <Heading marginTop="20" as="h2">Asset Transactions</Heading>
          <Text marginBottom="10">click the tx hash to view details of each transaction</Text>
            {unsigE?.lasttxs.map((tx,i) => {
              if (i < 4){
              return(
                <div key={tx}>
                <Heading as='h6' fontSize="md">tx hash</Heading>
                <a target="_blank" href={`https://explorer.cardano.org/en/transaction?id=${tx}`}>{tx}</a>
                </div>
              )}
            })}
          </>
          } 
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
