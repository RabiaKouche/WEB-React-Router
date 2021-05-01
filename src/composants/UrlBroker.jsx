import styles from '../App.module.scss';
import {useCallback} from 'react';


const UrlBroker = ({urlBroker, setUrlBroker, urlError}) => {

    const onChange = useCallback((event) => {
        setUrlBroker(event.target.value);
    }, [setUrlBroker]);

    return (
        <>
            <p className={styles.title}>URL du Broker:</p>
            <div className={`${styles.urlContainer} ${urlError ? styles.error : ''}`}>
                <input
                    className={styles.urlInput}
                    onChange={onChange}
                    value={urlBroker}
                />
                <span className={styles.urlSpan}>{urlBroker}</span>
            </div>
        </>
    );
};

export default UrlBroker;
