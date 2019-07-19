import React from 'react';
import Link from 'next/link';
import 'isomorphic-unfetch';

export default class ListIssues extends React.Component{
    state = {
        name: '',
        repos: '',
        issuesList: [],
        issuePages:[],
        page:1,
        isLoading:false
    };

    getData = async (page) => {
        const url = 'https://api.github.com/repos/'+this.state.name+'/'+this.state.repos+'/issues?per_page=10&page='+page;
        const res = await fetch(url);
        const json = await res.json();
        this.setState({
            issuesList: json,
            isLoading: false
        });
    };

    getAllData = async () => {
        const url = 'https://api.github.com/repos/'+this.state.name+'/'+this.state.repos;
        console.log(url);
        const res = await fetch(url);
        const json = await res.json();
        const pages = Math.ceil(json.open_issues_count / 10);
        this.setState({
            issuePages: Array.from(Array(pages).keys())
        });
    };

    handleClick = () => {
        const name = document.querySelector('.user-name').value;
        const repos = document.querySelector('.repos').value;
        this.setState({
            isLoading: true,
            name,
            repos
        });
        console.log(name,repos);
        setTimeout(() =>  {this.getAllData();
            this.getData(this.state.page); },10);
    };

    changePage = (operation) => {
        this.setState({
            isLoading: true
        });
        if (operation === '+' && (this.state.page < this.state.issuePages.length)) {
            this.getData(this.state.page+1);
            this.setState((prewState) => ({
                page: prewState.page + 1
            }))
        }
        if (operation === '-' && this.state.page > 1) {
            this.getData(this.state.page-1);
            this.setState((prewState) => ({
                page: prewState.page - 1
            }))
        }
    };

    selectPage = (pageNumber) => {
        this.setState({
            page: pageNumber,
            isLoading: true
        });
        this.getData(pageNumber);
    };

    render() {
        const loading = this.state.isLoading ? 'loader' : '';
        const opasityElem = this.state.isLoading ? 'list list-hide' : 'list';

        return (
            <div className="content">
                <input type="text" placeholder="Add user name" className="user-name"/>
                <input type="text" placeholder="Add repository" className="repos"/>
                <button onClick={this.handleClick}>ok</button>
                <div className={loading}></div>
                <div className={opasityElem}>
                    <div>{ this.state.issuesList.length === 0 ? 'No list' : ''}</div>
                    <div className={this.state.issuesList.length === 0 ? 'hide' : ''}>
                        <button className={this.state.page === 1 ? 'hide' : ''} onClick={()=>this.changePage('-')}>prew</button>
                        <span>{this.state.page}</span>
                        <button className={this.state.page === this.state.issuePages.length ? 'hide' : ''} onClick={()=>this.changePage('+')}>next</button>
                    </div>
                    <ul>
                        {this.state.issuesList.map(item =>
                            <PostLink
                                title={this.state.name+'/'+this.state.repos+'/issues/'+item.number}
                                name={item.title}
                                key={item.id}
                            />
                        )}
                    </ul>
                    <div>
                        {this.state.issuePages.map(item =>
                            <button key={item} onClick={()=>this.selectPage(item+1)}>{item+1}</button>
                        )}
                    </div>
                </div>
                <style jsx>{`
                    .content{
                        padding: 10%;
                        font-family: 'Arial', sans-serif;
                        color:#0C0874;
                    }
                    .content input{
                        border: 1px solid #0C0874;
                        border-radius: 5px;
                        margin: 5px;
                        padding: 5px;
                    }
                    .content a{
                        text-decoration: none;
                        color: black;
                    }
                    .content a:hover{
                        color: blue;
                    }
                    .content button{
                        border: 1px solid #0C0874;
                        border-radius: 5px;
                        background-color: white;
                        margin: 5px;
                    }

                    .hide{
                        display:none;
                    }
                    .list-hide{
                        background-color: white;
                        opacity:0.5;
                    }
                    .loader {
                        border: 10px solid #f3f3f3;
                        border-radius: 50%;
                        border-top: 10px solid #3498db;
                        width: 80px;
                        height: 80px;
                        position: absolute;
                        top: 40%;
                        left: 40%;
                        -webkit-animation: spin 2s linear infinite; /* Safari */
                        animation: spin 2s linear infinite;
                    }
                    @-webkit-keyframes spin {
                        0% { -webkit-transform: rotate(0deg); }
                        100% { -webkit-transform: rotate(360deg); }
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }
};

const PostLink = props => (
    <li>
        <Link href={`/issue?title=${props.title}`}>
            <a>{props.name}</a>
        </Link>
    </li>
);
