import './AutoRefreshToggle.css';
import React, {useEffect, useState} from "react";
import {Space, Switch, Typography} from "antd";
import {PauseCircleOutlined, SyncOutlined} from '@ant-design/icons';
import {motion} from 'framer-motion';

type Props = {
    className: string;
    toggleDefaultState: boolean;
    onToggle: (isToggle: boolean) => void;
}

const AutoRefreshToggle = ({className, toggleDefaultState, onToggle}: Props) => {
    const [isAutoRefresh, setIsAutoRefresh] = useState(toggleDefaultState);

    useEffect(() => {
        onToggle?.(isAutoRefresh);
    }, [isAutoRefresh, onToggle]);

    const handleClick = () => {
        setIsAutoRefresh(!isAutoRefresh);
    }

    return (
        <Space className={className}>
            <motion.div
                animate={{rotate: isAutoRefresh ? 360 : 0}}
                transition={{
                    repeat: isAutoRefresh ? Infinity : 0,
                    duration: 2,
                    ease: "linear"
                }}
            >
                {isAutoRefresh ? (
                    <SyncOutlined style={{fontSize: '24px', color: '#52c41a'}}/>
                ) : (
                    <PauseCircleOutlined style={{fontSize: '24px', color: '#faad14'}}/>
                )}
            </motion.div>
            <div>
                <Typography.Text type="secondary">Auto Refresh</Typography.Text>
                <div>
                    <Switch
                        checkedChildren='ON'
                        unCheckedChildren='OFF'
                        checked={isAutoRefresh}
                        onClick={handleClick}
                    />
                </div>
            </div>
        </Space>
    );
}

export default AutoRefreshToggle;