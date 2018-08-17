import * as using from 'jasmine-data-provider'

import Name from '../../src/aws/name'

describe('Name', () => {
  describe('Everything', () => {
    const n = new Name({
      index: 'index',
      region: 'region',
      service: 'service',
      stage: 'stage',
      table: 'table'
    })

    const names = {
      dimension: 'dynamodb:index:WriteCapacityUnits',
      metricRead: 'DynamoDBReadCapacityUtilization',
      metricWrite: 'DynamoDBWriteCapacityUtilization',
      policyRole: 'serviceDynamoDBAutoscalePolicyTableIndexStageRegion',
      policyScaleRead: 'serviceTableScalingPolicyReadTableIndexStageRegion',
      policyScaleWrite: 'serviceTableScalingPolicyWriteTableIndexStageRegion',
      role: 'serviceDynamoDBAutoscaleRoleTableIndexStageRegion',
      targetRead: 'serviceAutoScalingTargetReadTableIndexStageRegion',
      targetWrite: 'serviceAutoScalingTargetWriteTableIndexStageRegion'
    }

    using(names, (data, name) => {
      it(name, () => {
        expect(n[name]()).toEqual(data)
      })
    })
  })

  describe('No Index', () => {
    const n = new Name({
      index: '',
      region: 'region',
      service: 'service',
      stage: 'stage',
      table: 'table'
    })

    const names = {
      dimension: 'dynamodb:table:WriteCapacityUnits',
      metricRead: 'DynamoDBReadCapacityUtilization',
      metricWrite: 'DynamoDBWriteCapacityUtilization',
      policyRole: 'serviceDynamoDBAutoscalePolicyTableStageRegion',
      policyScaleRead: 'serviceTableScalingPolicyReadTableStageRegion',
      policyScaleWrite: 'serviceTableScalingPolicyWriteTableStageRegion',
      role: 'serviceDynamoDBAutoscaleRoleTableStageRegion',
      targetRead: 'serviceAutoScalingTargetReadTableStageRegion',
      targetWrite: 'serviceAutoScalingTargetWriteTableStageRegion'
    }

    using(names, (data, name) => {
      it(name, () => {
        expect(n[name]()).toEqual(data)
      })
    })
  })

  describe('Truncation', () => {
    const n = new Name({
      index: '',
      region: 'region',
      // tslint:disable-next-line
      service: 'service-with-a-very-long-name-so-even-max-256-char-policy-names-are-truncated-and-here-are-some-chars-to-get-there-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      stage: 'stage',
      table: 'table'
    })

    const names = {
      dimension: 'dynamodb:table:WriteCapacityUnits',
      metricRead: 'DynamoDBReadCapacityUtilization',
      metricWrite: 'DynamoDBWriteCapacityUtilization',
      // tslint:disable-next-line
      policyRole: 'servicewithaverylongnamesoevenmax256charpolicynamesaretruncatedandherearesomecharstogetthereaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab897d914a5b01dae70987a83fa026d7a',
      // tslint:disable-next-line
      policyScaleRead: 'servicewithaverylongnamesoevenmax256charpolicynamesaretruncatedandherearesomecharstogetthereaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa57f12d9a73df590a2ce5ffdf4f01e675',
      // tslint:disable-next-line
      policyScaleWrite: 'servicewithaverylongnamesoevenmax256charpolicynamesaretruncatedandherearesomecharstogetthereaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafa5d47d2764ba5143e0148491245ffba',
      role: 'servicewithaverylongnamesoevenma0fd19dd5edb88f835c278a1d2f9c5fa0',
      // tslint:disable-next-line
      targetRead: 'servicewithaverylongnamesoevenmax256charpolicynamesaretruncatedandherearesomecharstogetthereaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa6c032bdd08f3e85d6bab75fce30aeb42',
      // tslint:disable-next-line
      targetWrite: 'servicewithaverylongnamesoevenmax256charpolicynamesaretruncatedandherearesomecharstogetthereaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab1d233668cf726a01d0ded1523e8046c'
    }

    using(names, (data, name) => {
      it(name, () => {
        expect(n[name]()).toEqual(data)
      })
    })
  })
})
