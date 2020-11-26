import Tower from '../Tower/Tower';
import './Zone.css';

const Zone = (props) => {

    const buildTowersList = (isStronghold) => {
        const {filteredTowersList} = props;
        
        const towersList = isStronghold 
        ? filteredTowersList.filter(tower => tower.isStronghold)
        : filteredTowersList.filter(tower => !tower.isStronghold);

        return (
            <>
            {towersList.map(tower => {
                return (
                    <Tower 
                        key={tower.towerId} 
                        towerData={tower} 
                    />
                );
            })}
            </>
        );
    }

    return (
        <>
        <div className="content-headings-wrapper">
            <h3>Fort</h3>
        </div>
        <div className="towers-container">
            <div className="towers-header">
                <div className="towers-header-name towers-name-width">
                    <p>Name</p>
                </div>
                <div className="towers-header-team towers-team-width">
                    <p>Teams</p>
                </div>
            </div>
            <div className="towers-list">
                {buildTowersList(true)}
            </div>
        </div>
        <div className="content-headings-wrapper">
            <h3>Towers</h3>
        </div>
        <div className="towers-container">
            <div className="towers-header">
                <div className="towers-header-name towers-name-width">
                    <p>Name</p>
                </div>
                <div className="towers-header-team towers-team-width">
                    <p>Teams</p>
                </div>
            </div>
            <div className="towers-list">
                {buildTowersList(false)}
            </div>
        </div>
        </>
    );
}

export default Zone;