import React from 'react';

import { Pagination } from 'antd';
// Style
import s from './Flags.module.scss'
import { useRouter } from 'next/router';

const Flags = ({count}) => {
    const router = useRouter()

    const handleChangePagination = (numberPage) => {
        router.push(({
            query:{page: numberPage}
        }))
    }

    return (
        <div className={s.wrapper}>
            <Pagination
                total={count}
                className={s.wrapper__pagination}
                pageSize={12}
                showSizeChanger={false}
                showTitle={false}
                responsive={true}
                defaultCurrent={router.query.page}
                onChange={(numberPage) => handleChangePagination(numberPage)}
            />
        </div>
    );
};

export default Flags;