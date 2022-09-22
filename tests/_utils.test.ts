import { postQueryFromSlack, Utils } from "../src/_utils";

describe('Utils.toObjectFromSlackQuery', () => {
    let util: Utils;
    beforeAll(() => {
        util = new Utils();
    })

    test('queryストリングをオブジェクトに変換できること', () => {
        const inputQueryString = 'token=dummy_token&text=bar'
        let expected: postQueryFromSlack = {
            'token': 'dummy_token',
            'text': 'bar',
        };

        expect(util.toObjectFromSlackQuery(inputQueryString))
            .toStrictEqual(expected);
    })

    test('queryストリングをオブジェクトに変換できること_インターフェイスに定義されていないkey=valueも追加されること', () => {
        const inputQueryString = 'token=dummy_token&foo=bar'
        let expected: postQueryFromSlack = {'token': 'dummy_token'};
        expected['foo'] = 'bar';

        expect(util.toObjectFromSlackQuery(inputQueryString))
            .toStrictEqual(expected);
    })
})
