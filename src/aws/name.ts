import * as md5 from 'md5'
import * as util from 'util'

const TEXT = {
  DIMENSION: 'dynamodb:%s:%sCapacityUnits',
  METRIC: 'DynamoDB%sCapacityUtilization',
  POLICYROLE: 'DynamoDBAutoscalePolicy',
  POLICYSCALE: 'TableScalingPolicy-%s',
  ROLE: 'DynamoDBAutoscaleRole',
  TARGET: 'AutoScalingTarget-%s'
}

const MAX_LENGTH = {
  // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-limits.html
  DEFAULT: 255,
  // https://docs.aws.amazon.com/autoscaling/application/APIReference/API_PutScalingPolicy.html
  POLICY: 256,
  // https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-limits.html
  ROLE: 64
}

// only truncate if necessary
function clean(input: string, maxLength: number = Infinity): string {
  return truncate(input.replace(/[^a-z0-9+]+/gi, ''), maxLength)
}

function truncate(input: string, maxLength: number = MAX_LENGTH.DEFAULT): string {
  return input.length <= maxLength ? input : input.substr(0, maxLength - 32) + md5(input)
}

function ucfirst(data: string): string {
  return data.charAt(0).toUpperCase() + data.slice(1)
}

export default class Name {
  constructor(private options: Options) { }

  public metricRead(): string {
    return this.metric(true)
  }

  public metricWrite(): string {
    return this.metric(false)
  }

  public targetRead(): string {
    return this.target(true)
  }

  public targetWrite(): string {
    return this.target(false)
  }

  public policyScaleRead(): string {
    return this.policyScale(true)
  }

  public policyScaleWrite(): string {
    return this.policyScale(false)
  }

  public policyRole(): string {
    return clean(
      this.build(TEXT.POLICYROLE),
      MAX_LENGTH.POLICY
    )
  }

  public dimension(read: boolean): string {
    const type = this.options.index === '' ? 'table' : 'index'

    return util.format(TEXT.DIMENSION, type, read ? 'Read' : 'Write')
  }

  public role(): string {
    return clean(
      this.build(TEXT.ROLE),
      MAX_LENGTH.ROLE
    )
  }

  public target(read: boolean): string {
    return clean(
      this.build(TEXT.TARGET, read ? 'Read' : 'Write'),
      MAX_LENGTH.DEFAULT
    )
  }

  public policyScale(read: boolean): string {
    return clean(
      this.build(TEXT.POLICYSCALE, read ? 'Read' : 'Write'),
      MAX_LENGTH.POLICY
    )
  }

  public metric(read: boolean): string {
    return clean(
      util.format(TEXT.METRIC, read ? 'Read' : 'Write')
    )
  }

  private build(data: string, ...args: string[]): string {
    return [
      this.prefix(),
      args ? util.format(data, ...args) : data,
      this.suffix()
    ].join('')
  }

  private prefix(): string {
    return this.options.service
  }

  private suffix(): string {
    return [
      this.options.table,
      this.options.index,
      this.options.stage,
      this.options.region
    ].map(
      ucfirst
    ).join('')
  }
}
