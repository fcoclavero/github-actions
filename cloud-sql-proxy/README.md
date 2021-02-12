# cloud-sql-proxy

This action sets up a [Cloud SQL Proxy](https://cloud.google.com/sql/docs/postgres/sql-proxy) that can be used by later steps to connect to a [Cloud SQL](https://cloud.google.com/sql) instance via the specified prot in the localhost.

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

**Optional.** The IP where the port will be exposed in the localhost. Defaults to PostgreSQL's `${{ secrets.CLOUD_SQL_PROXY_PORT }}`.

## Example usage

Providing credentials in JSON format:

```yaml
steps:
  - uses: actions/checkout@v2
  - name: setup Cloud SQL proxy
    uses: ./cloud-sql-proxy
    with:
      credentials: ${{ secrets.SERVICE_ACCOUNT_KEY_JSON }}
      instance_connection_name: ${{ secrets.INSTANCE_CONNECTION_NAME }}
      port: ${{ secrets.CLOUD_SQL_PROXY_PORT }}
  - name: test connection
    run: psql "host=127.0.0.1 port=${{ secrets.CLOUD_SQL_PROXY_PORT }} sslmode=disable dbname=${{ secrets.DB_NAME }} user=${{ secrets.DB_USER_NAME }} password=${{ secrets.DB_PASSWORD }}"
```

Providing credentials in Base64 JSON format:

```yaml
steps:
  - uses: actions/checkout@v2
  - name: setup Cloud SQL proxy
    uses: ./cloud-sql-proxy
    with:
      credentials: ${{ secrets.SERVICE_ACCOUNT_KEY_B64 }}
      instance_connection_name: ${{ secrets.INSTANCE_CONNECTION_NAME }}
      port: ${{ secrets.CLOUD_SQL_PROXY_PORT }}
  - name: test connection
    run: psql "host=127.0.0.1 port=${{ secrets.CLOUD_SQL_PROXY_PORT }} sslmode=disable dbname=${{ secrets.DB_NAME }} user=${{ secrets.DB_USER_NAME }} password=${{ secrets.DB_PASSWORD }}"
```

Using the [`setup-gcloud`](../setup-gcloud/README.md) action with `export_default_credentials`:

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: ./setup-gcloud
    with:
      export_default_credentials: true
      service_account_key: ${{ secrets.SERVICE_ACCOUNT_KEY_B64 }}
  - name: setup Cloud SQL proxy
    uses: ./cloud-sql-proxy
    with:
      instance_connection_name: ${{ secrets.INSTANCE_CONNECTION_NAME }}
      port: ${{ secrets.CLOUD_SQL_PROXY_PORT }}
  - name: test connection
    run: psql "host=127.0.0.1 port=${{ secrets.CLOUD_SQL_PROXY_PORT }} sslmode=disable dbname=${{ secrets.DB_NAME }} user=${{ secrets.DB_USER_NAME }} password=${{ secrets.DB_PASSWORD }}"
```
