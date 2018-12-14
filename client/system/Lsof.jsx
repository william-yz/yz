import { useState } from 'react';
import {
  Form, Input, Button, Table,
} from 'antd';
import fetch from 'isomorphic-unfetch';

const { Item: FormItem } = Form;

const useSubmit = (port) => {
  const [data, setData] = useState([]);
  return {
    data,
    submit: async () => {
      const res = await fetch(`/api/system/lsof/list/${port}`).then(r => r.json());
      if (res.error === 0) {
        setData(res.result);
      } else {
        setData([]);
      }
    },
  };
};

const kill = (pid) => {
  fetch(`/api/system/lsof/kill/${pid}`, { method: 'DELETE' });
};
const getColumns = data => [...data.map((d, index) => ({
  dataIndex: index,
  title: d,
})), {
  dataIndex: 'Operation',
  title: 'Operation',
  render(text, record) {
    return (
      <Button onClick={() => kill(record[1])}>kill</Button>
    );
  },
}];

export default () => {
  const [port, setPort] = useState('');
  const { data, submit } = useSubmit(port);
  return (
    <>
      <FormItem
        label="Port"
      >
        <Input onChange={e => setPort(e.target.value)} />
      </FormItem>
      {
        data && data.length > 0
        && (
          <Table
            columns={getColumns(data[0])}
            dataSource={data.slice(1)}
            rowKey="1"
          />
        )
      }
      <Button onClick={submit}>Submit</Button>
    </>
  );
};
