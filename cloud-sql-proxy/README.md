# cloud-sql-proxy

This action gets an [OpenID Connect](https://developers.google.com/identity/protocols/OpenIDConnect) (OIDC) token and makes it available as an output variable. The token can then be used to [authenticate a service account](https://cloud.google.com/iap/docs/authentication-howto#authenticating_from_a_service_account) to an [Identity Aware Proxy](https://cloud.google.com/iap) secured resource.

## Prerequisites

* [Python](https://www.python.org/) 2.7.9 or later installed on the environment.
* A pre-configured GCP [service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts).
* `actions/checkout@v2` if using [`setup-gcloud`](../setup-gcloud/README.md) with `export_default_credentials`.

## Inputs

### `credentials`

**Optional.** The [service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys) to use for authentication. This key should be either in JSON format or as a [Base64](https://en.wikipedia.org/wiki/Base64) string (eg. `cat my-key.json | base64` on macOS). It should be stored as a [GitHub secret](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets). It can be ommited if using [`setup-gcloud`](../setup-gcloud/README.md) with `export_default_credentials`.

### `instance_connection_name`

**Required.** The DB's instance connection name. It can be retrieved from the DB's details in the [Cloud SQL console](https://console.cloud.google.com/sql/instances).

### `port`

**Optional.** The IP where the port will be exposed in the localhost. Defaults to PostgreSQL's `5432`.

## Example usage

Providing credentials in JSON format:

```yaml
steps:
  - uses: actions/checkout@v2
  - id: cloud-sql-proxy
    name: setup Cloud SQL proxy
    uses: ./cloud-sql-proxy
    with:
      credentials: ${{ secrets.SERVICE_ACCOUNT_KEY_JSON }}
      instance_connection_name: project_name:instance_region:instance_name
      port: 5432
```

Using the [`setup-gcloud`](../setup-gcloud/README.md) action with `export_default_credentials`:

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: ./setup-gcloud
    with:
      service_account_key: ${{ secrets.SERVICE_ACCOUNT_KEY_B64 }}
      export_default_credentials: true
  - id: cloud-sql-proxy
    name: setup Cloud SQL proxy
    uses: ./cloud-sql-proxy
    with:
      instance_connection_name: project_name:instance_region:instance_name
      port: 5432
```
