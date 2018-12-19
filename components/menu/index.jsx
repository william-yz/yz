import Router from 'next/router';
import { Menu } from 'antd';

const { SubMenu } = Menu;
const onClick = ({ key }) => {
  Router.push(key);
};

export default () => (
  <Menu
    mode="inline"
    onClick={onClick}
  >
    <SubMenu
      key="system"
      title="系统"
    >
      <Menu.Item key="/system/isof">杀死进程</Menu.Item>
      <Menu.Item key="/genetic">杀死进程</Menu.Item>
    </SubMenu>
  </Menu>);
