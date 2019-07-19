import Link from 'next/link'
import fetch from 'isomorphic-unfetch';

const Page = (props) => {
    return (
        <div>
            <Link href="/">
                <a>Back</a>
            </Link>
            <h2>{props.json.title}</h2>
            <p>Posted by {props.json.user.login} at {props.json.updated_at}</p>
            <pre>{props.json.body}</pre>
        </div>
    );
};
Page.getInitialProps = async function(context) {
    const { title } = context.query;
    const res = await fetch(`https://api.github.com/repos/${title}`);
    const json = await res.json();

     return { json };
};

export default Page;
