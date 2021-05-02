import { render, screen } from '@testing-library/react';
import App from './App';
import UrlBroker from './composants/UrlBroker';


describe('Url Broker', function () {
  const url = 'ws://random.pigne.org:9001';
  const setUrlBrokerMock = jest.fn();

  test('has url on screen', () => {
      render(<UrlBroker urlBroker={url} setUrlBroker={setUrlBrokerMock} urlError={false}/>);
      const urlBroker = screen.getByText(url);
      expect(urlBroker).toBeInTheDocument();
  });

test('has error className', () => {
      const {container} = render(<UrlBroker urlBroker={url} setUrlBroker={setUrlBrokerMock} urlError={true}/>);
      expect(container.lastChild).toHaveClass('error');
  });
});


describe('App', function () {
  test('has broker url on screen', () => {
      const url = 'ws://random.pigne.org:9001';
      render(<App/>);
      const urlBroker = screen.getByText(url);
      expect(urlBroker).toBeInTheDocument();
  });
});

