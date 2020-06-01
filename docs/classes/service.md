[@devim-front/react-sentry](../README.md) › [Service](service.md)

# Class: Service

Сервис, предоставляющий методы для интеграции с sentry.io.

**`see`** https://sentry.io/

## Hierarchy

* StrictService

  ↳ **Service**

## Index

### Constructors

* [constructor](service.md#markdown-header-constructor)

### Methods

* [debug](service.md#markdown-header-debug)
* [dispose](service.md#markdown-header-dispose)
* [error](service.md#markdown-header-error)
* [info](service.md#markdown-header-info)
* [log](service.md#markdown-header-log)
* [sendError](service.md#markdown-header-senderror)
* [warning](service.md#markdown-header-warning)
* [delete](service.md#markdown-header-static-delete)
* [get](service.md#markdown-header-static-get)
* [init](service.md#markdown-header-static-init)

## Constructors

### <a id="markdown-header-constructor" name="markdown-header-constructor"></a>  constructor

\+ **new Service**(`dsn?`: undefined | string): *[Service](service.md)*

*Overrides void*

Создает экземпляр сервиса с указанным параметрами.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dsn?` | undefined &#124; string | Client DSN.  |

**Returns:** *[Service](service.md)*

## Methods

### <a id="markdown-header-debug" name="markdown-header-debug"></a>  debug

▸ **debug**(`label`: string, `message`: string, `payload`: Record‹string, any›): *void*

Отправляет отладочное событие.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`label` | string | - | Метка события. |
`message` | string | - | Текст события. |
`payload` | Record‹string, any› | {} | Дополнительные параметры события.  |

**Returns:** *void*

___

### <a id="markdown-header-dispose" name="markdown-header-dispose"></a>  dispose

▸ **dispose**(): *void*

*Overrides void*

**`inheritdoc`** 

**Returns:** *void*

___

### <a id="markdown-header-error" name="markdown-header-error"></a>  error

▸ **error**(`label`: string, `message`: string, `payload`: Record‹string, any›): *void*

Отправляет событие ошибки.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`label` | string | - | Метка события. |
`message` | string | - | Текст события. |
`payload` | Record‹string, any› | {} | Дополнительные параметры события.  |

**Returns:** *void*

___

### <a id="markdown-header-info" name="markdown-header-info"></a>  info

▸ **info**(`label`: string, `message`: string, `payload`: Record‹string, any›): *void*

Отправляет информационное событие.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`label` | string | - | Метка события. |
`message` | string | - | Текст события. |
`payload` | Record‹string, any› | {} | Дополнительные параметры события.  |

**Returns:** *void*

___

### <a id="markdown-header-log" name="markdown-header-log"></a>  log

▸ **log**(`label`: string, `message`: string, `payload`: Record‹string, any›): *void*

Отправляет событие логгирования.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`label` | string | - | Метка события. |
`message` | string | - | Текст события. |
`payload` | Record‹string, any› | {} | Дополнительные параметры события.  |

**Returns:** *void*

___

### <a id="markdown-header-senderror" name="markdown-header-senderror"></a>  sendError

▸ **sendError**(`error`: Error): *void*

Принудительно отправляет указанную ошибку в sentry.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`error` | Error | Ошибка.  |

**Returns:** *void*

___

### <a id="markdown-header-warning" name="markdown-header-warning"></a>  warning

▸ **warning**(`label`: string, `message`: string, `payload`: Record‹string, any›): *void*

Отправляет событие предпреждения.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`label` | string | - | Метка события. |
`message` | string | - | Текст события. |
`payload` | Record‹string, any› | {} | Дополнительные параметры события.  |

**Returns:** *void*

___

### <a id="markdown-header-static-delete" name="markdown-header-static-delete"></a> `Static` delete

▸ **delete**(): *void*

*Inherited from [Service](service.md).[delete](service.md#markdown-header-static-delete)*

Удаляет существующий экземпляр сервиса, освобождая все занятые им ресурсы.

**Returns:** *void*

___

### <a id="markdown-header-static-get" name="markdown-header-static-get"></a> `Static` get

▸ **get**<**T**>(`this`: T): *InstanceType‹T›*

*Inherited from [Service](service.md).[get](service.md#markdown-header-static-get)*

*Overrides void*

Возвращает экземпляр сервиса. Если сервис ещё не был инициализирован
методом init, вызов get приведёт к ошибке.

**Type parameters:**

▪ **T**: *typeof SingleService*

**Parameters:**

Name | Type |
------ | ------ |
`this` | T |

**Returns:** *InstanceType‹T›*

___

### <a id="markdown-header-static-init" name="markdown-header-static-init"></a> `Static` init

▸ **init**(`dsn?`: undefined | string): *void*

*Overrides void*

Инициализирует сервис с указанным Client DSN (подробнее об этом параметре
смотри в документации sentry.io).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dsn?` | undefined &#124; string | Client DSN. Если не указать этот идентификатор, все события сервиса будут отправляться в браузерную консоль с уровнем debug и меткой 'sentry' вместо реальной отправки на сервер sentry.io.  |

**Returns:** *void*
