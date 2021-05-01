
import './App.css';
import {useEffect, useState} from 'react';
import mqtt from 'mqtt';
import {Sensor} from './Sensor';

import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import PropTypes from "prop-types";


const url = 'ws://random.pigne.org:9001';

const CapteurButton = ({name}) => {
    return (
        <Link to={`/${name}`}>
            <button type="button">
                {name}
            </button>
        </Link>
    );
};


const CapteurInfo = ({capteur}) => {
    return (
        <>
            <div>{capteur.name}</div>
            <div><h1>Valeur actuelle : <p>     {capteur.print(capteur.lastValue())}</p></h1></div>
            <div><h1>Historique :</h1></div>
            <table>
                {capteur.lastNValues(5).reverse().map(val => (
                  <table border='1'>
                    <tr>
                        <td>{capteur.print(val)}</td>
                    </tr>
                  </table>
                ))}
            </table>
        </>
    );
};


const App = () => {
    const [capteurs, setCapteurs] = useState([]);

    useEffect(() => {
        const client = mqtt.connect(url);
        client.on('connect', function () {
            client.subscribe('value/#', function (err) {
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
    }, []);

    return (
        <Router>
            <div>
                <header>
                    <p>URL du Broker:</p>
                    <div><input type="text" placeholder={url} onChange={PropTypes.onChange}/></div>
                </header>
                <div style={{display: 'flex'}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        {capteurs.map(capteur => <CapteurButton key={capteur.id} name={capteur.name}/>)}
                    </div>
                    <div>
                        <Switch>
                            {capteurs.map(capteur => (
                                <Route path={`/${capteur.name}`}>
                                    <CapteurInfo capteur={capteur}/>
                                </Route>
                            ))}
                        </Switch>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;
