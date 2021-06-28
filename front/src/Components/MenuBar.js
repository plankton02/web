import React from 'react';

function MenuBar(props) {
    const isConnected = props.isConnected
    return (
        <section className="container">
            <div className="has-text-centered content">
                <br/>
                <h1 className="title is-4 is-uppercase has-text-danger">Buy Token</h1>
                <h2 className="subtitle is-6 has-text-grey-light">NFT Tokens</h2>
                { isConnected 
                    ? <div className="column is-2 has-text-centered">
                        {/* <button onClick={() => props.disconnectMetamask() } className="button is-outlined is-small is-danger">
                            Disconnect
                        </button> */}
                    </div>
                    : <div className="column is-2 has-text-centered">
                    <button onClick={() => props.connectMetamask() } className="button is-outlined is-small is-danger">
                        Connect
                    </button>
                </div>
                }
            </div>
        </section>
    )
}

export default MenuBar;
    