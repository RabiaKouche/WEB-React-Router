
import styles from './App.module.scss';
import {useEffect, useState} from 'react';
import mqtt from 'mqtt';
import {Sensor} from './Sensor';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import LinkButton from './composants/LinkButton';
import UrlBroker from './composants/UrlBroker';



const url = 'ws://random.pigne.org:9001';

const CapteurButton = ({name}) => {
    return (
            <LinkButton
            to={`/${name}`}
            className={`${styles.AppButton}`}

        >
            {name}
        </LinkButton>
    );
};


const CapteurInfo = ({capteur}) => {
    return (
        <>
            
            <div className={styles.name}>{capteur.name}</div>
            <div className={styles.text}>Valeur actuelle:</div>
            <div className={styles.val}>{capteur.print(capteur.lastValue())}</div>
            <div className={styles.text}>Historique:</div>
            <div className={styles.historique}>
                <table>
                    {capteur.lastNValues(6).reverse().map(val => (
                        <tr>
                            <td>{capteur.print(val)}</td>
                        </tr>
                    ))}
                </table>
            </div>
        </>

    );
};


const App = () => {
   
    const [capteurs, setCapteurs] = useState([]);
    const [urlBroker, setUrlBroker] = useState(url);
    const [urlError, setUrlError] = useState(false);



    useEffect(() => {
        const client = mqtt.connect(urlBroker);
        client.stream.on('error', err => setUrlError(true));

        client.on('connect', function () {
            setUrlError(false);
            client.subscribe('value/#', function (err) {
                if (err !== null) {
                    setUrlError(true);
                    console.log(err);
                } else {
                    setUrlError(false);
                }

            });
        });
        client.on('message', function (topic, message) {
            const id = topic.substr(6);
            const obj = JSON.parse(message.toString());
            setCapteurs(capteurs => {
                let capteur = capteurs.find((c) => c.id === id);
                if (typeof capteur === 'undefined') {
                    capteur = new Sensor(id, obj.name, obj.value, obj.type);
                    return [...capteurs, capteur];
                } else {
                    capteur.addValue(obj.value);
                }
                return [...capteurs];
            });
        });
        return () => {
            client.end();
        };
    }, [urlBroker]);

    return (
        <Router>
            <div className={styles.App}>
                <header className={styles.AppHeader}>

                    <UrlBroker urlBroker={urlBroker} setUrlBroker={setUrlBroker} urlError={urlError}/>


                </header>
                <main className={styles.AppMain}>
                    <div className={styles.buttonList}>
                        {capteurs.map(capteur => (
                            <CapteurButton
                                key={capteur.id}
                                name={capteur.name}
                            />
                        ))}
                    </div>
                    <div className={styles.capteurInfo}>

                        <Switch>
                            {capteurs.map(capteur => (
                                <Route key={capteur.id} path={`/${capteur.name}`}>
                                    <CapteurInfo capteur={capteur}/>
                                </Route>
                            ))}
                        </Switch>
                    </div>
                    </main>
            </div>
        </Router>
    );
};

export default App;
