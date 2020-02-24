import React from 'react';
import { connect } from 'react-redux';
import { summaryRequest } from '../../actions/summaryActions';
import SpeechRecognition from 'react-speech-recognition';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import SendIcon from '@material-ui/icons/Send';
import Icon from '@material-ui/core/Icon';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import './SummaryBox.scss';

class summaryBox extends React.Component {
    state = {
        scriptText: '',
        summaryText: '',
        error: '',
        errorText: '',
        talkCheck: false,
        sendCheck: false,
        modalTalk: false,
        language: 'en',
        open: false,
        errorCheck: false
    };

    ScriptIn = '';
    state_stt = 'stop';
    componentDidUpdate(prevProps, prevState) {
        // if(this.state.sendCheck&&this.props.error!==null&&this.state.error===''){
        //     this.setState({

        //     })
        // }
        if (!this.state.errorCheck && this.props.error !== prevProps.error && this.props.error !== null) {
            this.setState({
                errorText: this.props.error,
                errorCheck: true
            });
        }
        if (this.props.summary !== prevProps.summary) {
            if (prevProps.summary !== '') {
                // let summaryArray = this.props.summary.split(' ');
                // summaryArray.unshift('<div><pre>');
                // summaryArray.push('</pre></div>');
                // let summarySpan = summaryArray.map(sum => {
                //     return `<span  onMouseOver={this.handleMouseOver}> ${sum}</span>`;
                // });
                // let summaryString = summarySpan.toString();
                if (this.state.summaryText !== '' && this.props.summary !== null)
                    this.setState({
                        summaryText: this.state.summaryText + '\n\n' + this.props.summary,
                        sendCheck: false
                    });
                else if (this.state.summaryText === '' && this.props.summary !== null)
                    this.setState({
                        summaryText: this.props.summary,
                        sendCheck: false
                    });
                else if (this.state.summaryText === '' && this.props.summary === null) return;
            }
        }
    }

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    useStyles() {
        makeStyles(theme => ({
            root: {
                width: '100%',
                '& > * + *': {
                    marginTop: theme.spacing(2)
                }
            }
        }));
    }

    fileUploadClick = e => {
        let file = e.target.files[0];

        let fileReader = new FileReader();
        fileReader.onload = () => {
            let afterStr = fileReader.result.split('\n');
            let filterStr = afterStr.filter(str => str.length > 1);
            this.setState({
                scriptText: filterStr
            });
        };
        fileReader.readAsText(file, 'UTF-8');
    };

    scriptChange = e => {
        let text = e.target.value;
        this.setState({
            scriptText: text
        });
    };
    handleError() {
        //if (this.state.error !== '' || this.props.error !== null) {
        if (this.state.errorText !== '') {
            setTimeout(() => {
                this.setState({
                    error: '',
                    sendCheck: false,
                    errorText: '',
                    errorCheck: false
                });
            }, 4000);
        }

        if (this.state.error === 'input') {
            return (
                <div className={this.useStyles.root}>
                    <Alert variant="filled" severity="error">
                        {this.state.errorText}
                    </Alert>
                </div>
            );
        } else if (this.state.error === 'length') {
            return (
                <div className={this.useStyles.root}>
                    <Alert variant="filled" severity="error">
                        {this.state.errorText}
                    </Alert>
                </div>
            );
        } else if (this.state.error === 'enter') {
            return (
                <div className={this.useStyles.root}>
                    <Alert variant="filled" severity="error">
                        {this.state.errorText}
                    </Alert>
                </div>
            );
        } else if (this.state.errorCheck) {
            return (
                <div className={this.useStyles.root}>
                    <Alert variant="filled" severity="error">
                        {this.state.errorText}
                    </Alert>
                </div>
            );
        }
    }

    handleSubmit = e => {
        const { scriptText } = this.state;

        e.preventDefault();

        if (scriptText === '') {
            this.setState({
                error: 'input',
                errorText: '문장을 입력해주세요!!!!!'
            });
            return;
        } else if (scriptText.length <= 50) {
            this.setState({
                error: 'length',
                errorText: '50글자 이상 입력해주세요!!!!!'
            });
            return;
        }
        let check = scriptText.indexOf('\n');
        if (check !== -1) {
            let textCehck = scriptText.substr(check + 1);
            check = textCehck.indexOf('\n');
            if (check === -1) {
                this.setState({
                    error: 'enter',
                    errorText: '띄어쓰끼 2번 이상 해주세요!!!!!'
                });
                return;
            }
        } else {
            this.setState({
                error: 'enter',
                errorText: '띄어쓰끼 2번 이상 해주세요!!!!!'
            });
            return;
        }
        //stop STT
        if (this.props.listening) {
            this.props.stopListening();
            this.setState({
                talkCheck: false
            });
            this.state_stt = 'stop';
        }

        this.props.summaryRequest({ text: scriptText, language: this.state.language });
        this.setState({
            error: '',
            sendCheck: true
        });
    };

    handleDelete = e => {
        this.ScriptIn = '';

        this.setState({
            scriptText: '',
            summaryText: ''
        });
    };
    handleTalkClick = e => {
        if (!this.props.browserSupportsSpeechRecognition) {
            return null;
        }
        if (this.props.listening) {
            this.props.stopListening();
            this.setState({
                talkCheck: false,
                modalTalk: false
            });
            this.state_stt = 'stop';
        } else {
            if (this.state.language === 'en') {
                this.props.recognition.lang = 'en-us';
            } else {
                this.props.recognition.lang = 'ko-kr';
            }

            this.props.startListening();
            this.setState({
                talkCheck: true,
                modalTalk: true
            });
            this.state_stt = 'ready';
        }
    };
    componentWillReceiveProps(nextProps) {
        // console.log("strat")
        // console.log(this.state_stt)
        // console.log(this.props.finalTranscript )
        // console.log(this.props.interimTranscript )
        if (this.state_stt !== 'stop') {
            if (nextProps.listening) {
                if (this.state_stt === 'stream') {
                    if (nextProps.interimTranscript !== '') {
                        this.setState({
                            scriptText: this.ScriptIn + nextProps.interimTranscript
                        });
                    } else {
                        this.state_stt = 'final';
                    }
                }
                if (this.state_stt === 'ready') {
                    if (nextProps.finalTranscript === '' && nextProps.interimTranscript !== '') {
                        this.state_stt = 'stream';
                    }
                }
                if (this.state_stt === 'final') {
                    this.setState({
                        scriptText: this.ScriptIn + nextProps.finalTranscript
                    });
                    nextProps.resetTranscript();

                    this.ScriptIn = this.state.scriptText + ' \n';
                    //console.log(this.state_stt)
                    this.state_stt = 'ready';
                }
            }
        } else if (this.state_stt !== 'ready') {
            if (nextProps.finalTranscript !== '' || nextProps.interimTranscript !== '') {
                this.ScriptIn = this.state.scriptText + ' \n';

                nextProps.resetTranscript();
            }
            //this.ScriptIn = this.state.scriptText
        }
        // console.log("end")
        // console.log(this.state_stt)
        // console.log(this.props.finalTranscript )
        // console.log(this.props.interimTranscript )
    }

    voiceChange = e => {
        if (this.props.listening) {
            if (this.props.transcript !== this.state.scriptText) {
                if (this.props.finalTranscript !== '') {
                    if (this.props.interimTranscript === '') {
                        this.props.resetTranscript();
                        this.setState((state, props) => ({
                            scriptText: state.scriptText + this.props.finalTranscript + '.\n'
                        }));
                    }
                } else {
                }
            }
        }
    };

    talkView(check) {
        if (check)
            return (
                <Button
                    className="talk_on Button talk_checkon"
                    variant="contained"
                    startIcon={<KeyboardVoiceIcon />}
                    onClick={this.handleTalkClick}
                >
                    Talk
                </Button>
            );
        else
            return (
                <Button
                    className="Button talk_checkoff"
                    variant="contained"
                    startIcon={<KeyboardVoiceIcon />}
                    onClick={this.handleTalkClick}
                >
                    Talk
                </Button>
            );
    }

    sendView(check) {
        if (check)
            return (
                <Button variant="contained" className="sned_on Button sendon" onClick={this.handleSubmit}>
                    <CircularProgress color="secondary" />
                </Button>
            );
        else
            return (
                <Button
                    className="Button send"
                    variant="contained"
                    endIcon={
                        <Icon>
                            <SendIcon />
                        </Icon>
                    }
                    onClick={this.handleSubmit}
                >
                    Send
                </Button>
            );
    }

    handleLanguage = e => {
        if (e.target.value === 'en') {
            this.props.recognition.lang = 'en-us';
        } else {
            this.props.recognition.lang = 'ko-kr';
        }

        this.setState({
            language: e.target.value
        });
    };

    handleMouseOver = e => {
        console.log(e);
    };

    modalTalkOpen() {
        this.setState({
            modalTalk: true
        });
    }
    modalTalkClose = e => {
        this.setState({
            modalTalk: false
        });
    };

    handleListItemClick(e) {
        if (e === 'en') {
            this.props.recognition.lang = 'en-us';
        } else {
            this.props.recognition.lang = 'ko-kr';
        }
        this.setState({
            modalTalk: false,
            language: e
        });
    }
    render() {
        let innerH = window.innerHeight;
        let rs = Math.round((innerH * 0.8) / 19) - 3;
        let H = Math.round(innerH / 10);
        return (
            <div className="bodyconttainer">
                <Dialog
                    open={this.state.errorText === '' ? false : true}
                    onClose={() =>
                        this.setState({
                            error: '',
                            sendCheck: false,
                            errorText: '',
                            errorCheck: false
                        })
                    }
                >
                    <DialogTitle>에러 발생</DialogTitle>
                    <DialogContent>{this.state.errorText}</DialogContent>
                </Dialog>
                <Dialog open={this.state.modalTalk} onClose={this.modalTalkClose}>
                    <DialogTitle>언어 선택</DialogTitle>
                    <List>
                        <ListItem button onClick={() => this.handleListItemClick('en')}>
                            <ListItemText primary={'en'} />
                        </ListItem>
                        <ListItem button onClick={() => this.handleListItemClick('kr')}>
                            <ListItemText primary={'kr'} />
                        </ListItem>
                    </List>
                </Dialog>
                <Grid container spacing={1} className="Textcontainer">
                    <Grid item xs={12}>
                        <form noValidate autoComplete="off">
                            <div className="TextBox input">
                                <TextField
                                    className="textfield"
                                    id="outlined-basic"
                                    label="input text"
                                    multiline={true}
                                    type="text"
                                    rows={rs}
                                    size="medium"
                                    variant="outlined"
                                    value={this.state.scriptText}
                                    onChange={this.scriptChange}
                                />
                            </div>
                            <div className="TextBox output">
                                <TextField
                                    className="textfield"
                                    id="filled-basic"
                                    label="summary"
                                    multiline={true}
                                    type="text"
                                    rows={rs}
                                    size="medium"
                                    variant="outlined"
                                    value={this.state.summaryText}
                                    // onMouseOver={this.handleMouseOver}
                                />
                            </div>

                            {/* <div display="inline" style={{ width: '49%' }} height="300px">
                            s{this.state.summaryText}
                        </div> */}
                        </form>
                    </Grid>
                </Grid>
                <Grid container alignItems="stretch">
                    <Grid item xs={12}>
                        {this.handleError()}
                    </Grid>
                    <div className="ButtonContainer">
                        <Grid item xs={3}>
                            <Button
                                className="Button upload"
                                variant="contained"
                                component="label"
                                color="default"
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload
                                <input id="raised-button-file" style={{ display: 'none' }} type="file" onChange={this.fileUploadClick} />
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            {this.talkView(this.state.talkCheck)}
                        </Grid>
                        <Grid item xs={3}>
                            {this.sendView(this.state.sendCheck)}
                        </Grid>
                        <Grid item xs={3}>
                            <Button className="Button delete" variant="contained" startIcon={<DeleteIcon />} onClick={this.handleDelete}>
                                Delete
                            </Button>
                        </Grid>
                    </div>

                    {/* {this.voiceChange()} */}

                    <Grid item xs={12} className="footerContainer">
                        <FormControl style={{ width: '50%', left: '25%' }}>
                            <Select value={this.state.language} onChange={this.handleLanguage} displayEmpty style={{ textAlign: 'center' }}>
                                <MenuItem value={'en'}>English</MenuItem>
                                <MenuItem value={'kr'}>Korea</MenuItem>
                            </Select>
                            <FormHelperText style={{ textAlign: 'center' }}>Language</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        summary: state.summary.summary,
        error: state.summary.error
    };
};

const options = {
    autoStart: false
};

export default connect(mapStateToProps, { summaryRequest })(SpeechRecognition(options)(summaryBox));
