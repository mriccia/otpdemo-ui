import React from "react";

const API_URL="https://g5jkd50ck5.execute-api.eu-west-1.amazonaws.com/Prod";

class OtpForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {phoneNumber: '', otp:'', mobileSubmitted: false, otpSubmitted: false};
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeOtp = this.handleChangeOtp.bind(this);
        this.submitOtp = this.submitOtp.bind(this);
        this.generateOtp = this.generateOtp.bind(this);
        this.back = this.back.bind(this);
    }

    handleChange(event) {
        this.setState({phoneNumber: event.target.value});
    }
    handleChangeOtp(event) {
        this.setState({otp: event.target.value});
    }
    back(event){
        this.setState({otpSubmitted: false});
    }

    async submitOtp(event) {
        event.preventDefault();
        //Make API call to validate OTP
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: this.state.phoneNumber, otp: `${this.state.otp}` })
        };

        const response = await fetch(`${API_URL}/validate-otp`, requestOptions);
        try{
            const data = await response.json();
            if (response.ok){
                this.setState({message: "Successfully verified OTP"});
            }else{
                this.setState({message: data.message});
            }
        }catch (e){
            this.setState({message: "OTP invalid"});
        }

        this.setState({
            otpSubmitted: true
        });
    }

    async generateOtp(event) {
        event.preventDefault();
        //Make API call to generate OTP
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: this.state.phoneNumber })
        };

        const response = await fetch(`${API_URL}/generate-otp`, requestOptions);
        const data = await response.json();

        this.setState({
            mobileSubmitted: true
        });
    }

    noOp(event) {
        event.preventDefault();
    }

    render() {
        const mobileSubmitted = this.state.mobileSubmitted;
        const otpSubmitted = this.state.otpSubmitted;
        return (
            <div>
                {!mobileSubmitted &&
                <form onSubmit={this.generateOtp}>
                    <div>
                        <label>
                            Phone number:
                            <input type="text" value={this.state.phoneNumber} onChange={this.handleChange}/>
                        </label>
                    </div>
                    <input type="submit" value="Request OTP"/>
                </form>
                }
                {(mobileSubmitted && !otpSubmitted) &&
                <form onSubmit={this.submitOtp}>
                    <div>
                        <label>
                            Phone number:
                            <input type="text" value={this.state.phoneNumber} disabled/>
                        </label>
                    </div>
                    <div>
                        <label>
                            OTP:
                            <input type="text" value={this.state.otp} onChange={this.handleChangeOtp}/>
                        </label>
                    </div>
                    <input type="submit" value="Submit OTP"/>
                </form>
                }
                {(mobileSubmitted && otpSubmitted) &&
                <form onSubmit={this.back}>
                    <div>
                        <label>
                            Phone number:
                            <input type="text" value={this.state.phoneNumber} disabled/>
                        </label>
                    </div>
                    <div>
                        <label>
                            OTP:
                            <input type="text" value={this.state.otp} disabled/>
                        </label>
                    </div>
                    <div>
                        <label>{this.state.message}</label>
                    </div>
                    <input type="submit" value="Back"/>
                </form>
                }
            </div>
        )
    }
}

export default OtpForm;
