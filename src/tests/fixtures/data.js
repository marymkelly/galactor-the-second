const stars = [ //test data
    {
        '$': { id: '232' },
        catId: ['ε UMa'],
        ra: ['12.9004722'],
        de: ['55.959722'],
        mag: ['1.77']
    },
    {
        '$': { id: '235' },
        catId: ['α UMa'],
        ra: ['11.0621389'],
        de: ['61.750833'],
        mag: ['1.79']
    },
    {
        '$': { id: '275' },
        catId: ['α Maα'],
        ra: ['13.39875'],
        de: ['54.925278'],
        mag: ['2.27']
    },
    {
        '$': { id: '275' },
        catId: ['ζ UMa'],
        ra: ['13.39875'],
        de: ['54.925278'],
        mag: ['2.27']
    },
    {
        '$': { id: '281' },
        catId: ['β Ma'],
        ra: ['11.0306944'],
        de: ['56.3825'],
        mag: ['2.37']
    }
];

const parsedStars = [ //test data
    {
        '$': { id: '232' },
        catId: ['ε UMa'],
        ra: ['12.9004722'],
        de: ['55.959722'],
        mag: ['1.77']
    },
    undefined
    ,
    {
        '$': { id: '275' },
        catId: ['α Maα'],
        ra: ['13.39875'],
        de: ['54.925278'],
        mag: ['2.27']
    },
    undefined
    ,
    {

        '$': { id: '281' },
        catId: ['β Ma'],
        ra: ['11.0306944'],
        de: ['56.3825'],
        mag: ['2.37']
    }
]

const error = {
    isAxiosError: true,
    toJSON: function() { return stars },
    message: 'Server Problem Caused Server Error',
    response: {
        status: 502,
        data: `<html><body><h1>502 Status Code</h1>Server unable to complete or returned impartial response</body><html>`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
    }
}

export { stars as default, error };