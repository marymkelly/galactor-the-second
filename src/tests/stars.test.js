import axios from 'axios'
import getStars from './fixtures/api'
import stars, { error } from './fixtures/data'

jest.mock('axios');

test('should fetch stars with validation assumed', () => {
    const res = stars;
    axios.get.mockResolvedValue(res)
    console.log(res)

    return getStars.success().then(res => expect(res).toEqual(stars));
});

test('should fail to fetch stars from server error', () => {
    const err = { error };
    axios.get.mockRejectedValue(err);
    console.log(err)

    return getStars.err().then(error => expect(err).toEqual(error));
});
