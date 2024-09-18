import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryHttpInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    const newreq = { ...req };
    const keyName = req.params.get('keyName');
    const action = req.params.get('action');
    const path = req.params.get('path');
    //console.log(' req=', req); // gridConfig
    //console.log(' req.params=', req.params);
    //console.log(' keyName=', req.params.get('keyName'));
    if (keyName && action === 'gridData') {
      newreq.url = `/api/${keyName}`;
      newreq.urlWithParams = req.urlWithParams.replace(req.url, newreq.url);
      //console.log(' newreq=', newreq);
    } else if (keyName && action === 'columnConfig') {
      newreq.url = newreq.urlWithParams = `/api/${keyName}_${action}`;
    } else if (keyName && action === 'gridConfig') {
      newreq.url = newreq.urlWithParams = `/api/${keyName}_${action}`;
    } else if (keyName && action === 'select') {
      newreq.url = newreq.urlWithParams = `/api/${keyName}_${path}`;
    } else if (keyName && action === 'selectFieldConfig') {
      newreq.url = newreq.urlWithParams = `/api/${keyName}_${path}FieldConfig`;
    } else {
      newreq.url = newreq.urlWithParams = `/api/${keyName}_${action}`;
      //console.log( ' newreq.url=', newreq.url)
    }

    return next.handle(newreq as HttpRequest<any>);
  }
}
