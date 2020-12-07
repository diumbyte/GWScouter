import { Component } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Countdown from 'react-countdown';
import ClockIcon from '../../assets/clock.svg'
import { nextTargetDayOfWeek } from '../../helpers/dateHelpers';
import './BattleCountdown.css'

export default class BattleCountdown extends Component {

    constructor(props) {
        super(props)

        this.state = {
            isActiveBattle: false,
            targetTime: new Date()
        };
    }

    componentDidMount = async () => {
        let res;
        try {
            res = await axios.get(`/api/battle/time`);
        } catch(err) {
            const { data } = err.response;
            return data.errors.forEach(err => toast.error(`${err.msg}`))
        }

        const { data } = res;

        const targetTime = data.is_active 
            ? data.ends_at
            : nextTargetDayOfWeek([1,3,5]).toJSDate();
        
        this.setState({
            isActiveBattle: data.is_active,
            targetTime
        })
    }

    countdownRenderer = ({hours, minutes, seconds, completed, ...props}) => {
        let timeFormat;
        const { isActiveBattle } = this.state;

        // How to display time
        if(hours >= 1) {
            timeFormat = `${hours}h ${minutes}m`
        } else {
            timeFormat = `${minutes}m`
        }

        // Text to concat with
        if(isActiveBattle) {
            timeFormat += ` until battle ends`
        } else {
            timeFormat += ` until battle begins`
        }

        return (
        <div className="countdown-container">
            <img src={ClockIcon} className="svg-icon" alt="Clock icon" />
            <span>{timeFormat}</span>
        </div>
        );
    }

    render() {
        const { targetTime } = this.state;
        return (
            <Countdown 
                key={targetTime}
                date={targetTime} 
                daysInHours
                renderer={this.countdownRenderer}
            />
        );
    }
}