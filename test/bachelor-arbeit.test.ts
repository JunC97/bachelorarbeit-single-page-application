import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as BachelorArbeit from '../lib/bachelor-arbeit-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new BachelorArbeit.BachelorArbeitStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
