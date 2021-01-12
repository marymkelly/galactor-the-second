import axios from 'axios';

class Stars {
    static success() {
        return axios.get('http://server.stars.xml').then(res => res)
    }

    static err(){
        return axios.get('http://server.stars.xml').catch(error =>  error )
    }
}

export default Stars;
