import React from 'react';
import { Typography, Empty, Spin, Button, List, Tag } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { goTo } from 'react-chrome-extension-router';
import { useQuery } from 'react-query';
import CxsecurityChoose from './CxsecurityChoose';

const { Title } = Typography;

const fetchApi = async () => {
    const res = await fetch(
        'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcxsecurity.com%2Fwlb%2Frss%2Fvulnerabilities%2F&api_key=cpe1hekkfknhpeqov1hvcojojd9csg01yqybwsaw&count=100'
    );
    return res.json();
};

export default function BugsCX () {
    const { data, status } = useQuery( 'cisco', fetchApi );

    interface IBugsCX {
        content: any;
        title: string;
        link: string;
        author: string;
    }

    return (
        <div>
            <PageHeader
                onBack={() => goTo( CxsecurityChoose )}
                title='Vulnerabilities Database'
                subTitle='World Laboratory of Bugtraq 2 CXSecurity.com'
            />
            {status === 'loading' && (
                <div style={{ textAlign: 'center' }}>
                    <Spin />
                    <Empty />
                </div>
            )}
            {status === 'error' && (
                <React.Fragment>
                    <Empty
                        image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
                        imageStyle={{
                            height: 60
                        }}
                        description={<span>Error getting the data please contact us.</span>}
                    >
                        <Button href='https://github.com/Cyb3rHq/ThreatMap/issues' target='blank' danger>
                            Report the bug
                        </Button>
                    </Empty>
                </React.Fragment>
            )}
            {status === 'success' && (
                <div
                    key='a'
                    style={{
                        padding: 15
                    }}
                >
                    <Title
                        level={4}
                        style={{
                            fontWeight: 'bold',
                            marginTop: 15
                        }}
                    >
                        Recent Vulnerabilities
                    </Title>
                    <List
                        itemLayout='horizontal'
                        dataSource={data.items}
                        style={{ marginTop: 15 }}
                        renderItem={( list: IBugsCX ) => (
                            <List.Item
                                actions={[
                                    <div>
                                        {( () => {
                                            const severityLevel = list.content.match( /Risk: (\w{1,})/ );
                                            if ( !severityLevel ) {
                                                return 'None';
                                            } else {
                                                switch ( severityLevel[ 1 ] ) {
                                                    case 'High':
                                                        return <Tag color='red'>{severityLevel[ 1 ]}</Tag>;
                                                    case 'Medium':
                                                        return <Tag color='orange'>{severityLevel[ 1 ]}</Tag>;
                                                    case 'Low':
                                                        return <Tag color='green'>{severityLevel[ 1 ]}</Tag>;
                                                    default:
                                                        return 'None';
                                                }
                                            }
                                        } )()}
                                    </div>,
                                    <Tag color='geekblue' style={{ marginLeft: 5 }}>
                                        {list.author}
                                    </Tag>
                                ]}
                            >
                                <a href={list.link} target='_blank' rel='noreferrer noopener'>
                                    {list.title}
                                </a>
                            </List.Item>
                        )}
                    />
                </div>
            )}
        </div>
    );
}
